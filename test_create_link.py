import requests

API_URL = "https://crytotrade-pro-r1gs.onrender.com/api"

def test_create_link():
    # 1. Login
    print("Attempting login...")
    login_res = requests.post(f"{API_URL}/login/", json={
        "username": "admin",
        "password": "admin123"
    })
    
    if login_res.status_code != 200:
        print(f"Login failed: {login_res.status_code} {login_res.text}")
        return

    token = login_res.json().get('token')
    print(f"Login success. Token: {token[:10]}...")

    # 2. Create link
    print("Attempting to create a link...")
    headers = {
        "Authorization": f"Token {token}",
        "Content-Type": "application/json"
    }
    create_res = requests.post(f"{API_URL}/links/", json={
        "name": "Test Link From Antigravity",
        "description": "Testing 500 error",
        "submissions_limit": 0
    }, headers=headers)

    print(f"Response Status: {create_res.status_code}")
    print(f"Response Body: {create_res.text}")

if __name__ == "__main__":
    test_create_link()
