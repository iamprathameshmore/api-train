import pandas as pd
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from typing import List

SCOPES = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']

# You need to provide the path to your Google service account credentials JSON file
GOOGLE_CREDENTIALS_FILE = 'google-credentials.json'

def get_gspread_client():
    creds = ServiceAccountCredentials.from_json_keyfile_name(GOOGLE_CREDENTIALS_FILE, SCOPES)
    client = gspread.authorize(creds)
    return client

def fetch_sheet_as_dataframe(sheet_url: str, worksheet_name: str = None) -> pd.DataFrame:
    client = get_gspread_client()
    sheet = client.open_by_url(sheet_url)
    worksheet = sheet.worksheet(worksheet_name) if worksheet_name else sheet.get_worksheet(0)
    data = worksheet.get_all_records()
    df = pd.DataFrame(data)
    return df 