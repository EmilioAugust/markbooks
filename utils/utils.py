async def get_icon_url(domain: str):
    url = f'https://www.google.com/s2/favicons?domain={domain}&sz=128'
    return url