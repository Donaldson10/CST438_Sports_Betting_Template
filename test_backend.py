#!/usr/bin/env python3
import requests
import json

# Test the backend teams endpoint
try:
    response = requests.get("https://project2-438-backend-c8e29941b290.herokuapp.com/teams")
    print(f"Status Code: {response.status_code}")
    print(f"Response text: '{response.text}'")
    print(f"Content-Type: {response.headers.get('content-type', 'Not specified')}")
    if response.status_code == 200:
        if response.text.strip():
            try:
                teams = response.json()
                print(f"Number of teams: {len(teams)}")
                if teams:
                    print("First team structure:")
                    print(json.dumps(teams[0], indent=2))
            except json.JSONDecodeError as e:
                print(f"JSON decode error: {e}")
        else:
            print("Empty response")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Error: {e}")