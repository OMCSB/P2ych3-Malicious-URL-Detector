import re

def tokenize_url_regex(url):
  # Match everything except "/" or "."
  # print(url)
  try: 
    tokens = url.split("://", 1)[1]
    pattern = r"([^\./]+)"
    return re.findall(pattern, tokens)
  except:
    pattern = r"([^\./]+)"
    return re.findall(pattern, url)