from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

from routes.stable_diffusion import setup_stable_diffusion_route
from routes.llava import setup_llava_route
from routes.sdxl_lightning import setup_sdxl_lightning_route
from routes.gpt import setup_gpt_route
from routes.audio import setup_audio_route
from routes.learning_plan import setup_learning_plan_route
from routes.assessment import setup_assessment_route

load_dotenv()
app = Flask(__name__)
CORS(app)

# Setup routes
setup_stable_diffusion_route(app)
setup_llava_route(app)
setup_sdxl_lightning_route(app)
setup_gpt_route(app)
setup_audio_route(app)
setup_learning_plan_route(app)
setup_assessment_route(app)

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3001))
    app.run(port=port)
