import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
from PIL import Image

app = Flask(__name__)
CORS(app)

# Load the pre-trained face detection model
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def detect_face(image):
    # Convert the image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # Detect faces
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    return faces

@app.route('/detect-face', methods=['POST'])
def detect_face_route():
    data = request.json
    image_data = base64.b64decode(data['image'])
    image = np.array(Image.open(io.BytesIO(image_data)))

    faces = detect_face(image)
    face_detected = len(faces) > 0

    label = "Looking away"
    if face_detected:
        label = "Looking at the screen"

    # Draw bounding box and label on the image
    for (x, y, w, h) in faces:
        cv2.rectangle(image, (x, y), (x+w, y+h), (255, 0, 0), 2)
        cv2.putText(image, label, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 0), 2)

    _, buffer = cv2.imencode('.jpg', image)
    image_base64 = base64.b64encode(buffer).decode('utf-8')

    return jsonify({
        'image': image_base64,
        'faceDetected': face_detected,
        'label': label
    })

if __name__ == '__main__':
    app.run(port=3002)
