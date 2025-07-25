import os
import shutil
from datetime import datetime
from src.config.settings import APP_NAME

def delete_uploads():
    print(f"[{APP_NAME}] Running cleanup at {datetime.now()}")

    folders = ["uploads/models", "uploads/datasets"]
    for folder in folders:
        if os.path.exists(folder):
            for file in os.listdir(folder):
                file_path = os.path.join(folder, file)
                try:
                    if os.path.isfile(file_path):
                        os.remove(file_path)
                    elif os.path.isdir(file_path):
                        shutil.rmtree(file_path)
                except Exception as e:
                    print(f"[{APP_NAME}] Error deleting {file_path}: {str(e)}")
