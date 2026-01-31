import requests

BASE_URL = "http://localhost:8000"

def test_auth():
    print("Testing Authentication Process...")
    
    # 1. Register
    reg_data = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "pipeline123"
    }
    
    # Check if user exists first (skip registration if so)
    # Login
    login_data = {"username": "testuser", "password": "pipeline123"}
    try:
        resp = requests.post(f"{BASE_URL}/auth/login", data=login_data)
        if resp.status_code == 200:
             print("User already exists, logged in successfully.")
             token = resp.json()["access_token"]
        else:
             print("Registering new user...")
             reg_resp = requests.post(f"{BASE_URL}/auth/register", json=reg_data)
             if reg_resp.status_code != 200:
                 print(f"Registration failed: {reg_resp.text}")
                 return
             print("Registration successful.")
             
             # then login
             resp = requests.post(f"{BASE_URL}/auth/login", data=login_data)
             token = resp.json()["access_token"]
    except Exception as e:
        print(f"Connection error: {e}")
        return

    print(f"Got Access Token: {token[:15]}...")

    # 2. Access Protected Route
    headers = {"Authorization": f"Bearer {token}"}
    me_resp = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    
    if me_resp.status_code == 200:
        print("Protected route /auth/me accessed successfully!")
        print("User Profile:", me_resp.json())
    else:
        print(f"Failed to access protected route: {me_resp.status_code} {me_resp.text}")

if __name__ == "__main__":
    test_auth()
