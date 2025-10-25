import requests
from bs4 import BeautifulSoup

async def get_title_website(website: str):
    try:
        url = website
        response = requests.get(url)
        response.raise_for_status()

        html_content = response.text

        soup = BeautifulSoup(html_content, 'html.parser')
        title = soup.find('title').string
        return title
    except requests.exceptions.RequestException as e:
        print("An error occured:", e)
