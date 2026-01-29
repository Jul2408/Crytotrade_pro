import requests
import json

url = "http://127.0.0.1:8000/api/login/"
data = {
    "username": "admin",
    "password": "admin123"
}
headers = {
    "Content-Type": "application/json"
}

try:
    print(f"Sending POST to {url} with data: {data}")
    response = requests.post(url, json=data, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
