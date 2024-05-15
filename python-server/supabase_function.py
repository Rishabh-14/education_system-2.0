# supabase_functions.py
import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

# Initialize Supabase client
supabase_url = os.getenv('SUPABASE_URL')  # Environment variable for the URL
supabase_key = os.getenv('SUPABASE_KEY')  # Environment variable for the key
supabase: Client = create_client(supabase_url, supabase_key)

def upload_to_supabase(index, persist_dir):
    """
    Uploads the given index to Supabase storage.

    Args:
        index: The index to serialize and upload.
        persist_dir: The directory path in Supabase storage to upload the index.

    Raises:
        Exception: If the upload fails.
    """
    # Serialize the index
    index_data = index.serialize()

    # Upload to Supabase
    response = supabase.storage().from_('indices').upload(persist_dir, index_data)
    if response.error:
        raise Exception(f"Failed to upload index: {response.error.message}")
