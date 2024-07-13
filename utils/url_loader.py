import re
from tld import get_tld
from urllib.parse import urlparse

def tokenize_url_regex(url):
  # Match everything except "/" or "."
#   print(url)
  try: 
    tokens = url.split("://", 1)[1]
    pattern = r"([^\./]+)"
    return re.findall(pattern, tokens)
  except:
    pattern = r"([^\./]+)"
    return re.findall(pattern, url)

def count_digits(url):
  return len(re.sub("[^0-9]", "", url))

def count_nonDigitsAlpahbet(url):
  return len(re.sub("[\w]", "", url))

def get_domain_name(url):
    try:
#         Extract the top level domain (TLD) from the URL given
        res = get_tld(url, as_object = True, fail_silently=False,fix_protocol=True)
        pri_domain= res.parsed_url.netloc
    except :
        pri_domain=url
    return pri_domain

# def encrypt_url(url):
#   # print(url)
#   temp_url=[]
#   for char in url:
#     try: 
#       if int(char) == char:
#         temp_url.append(str(char))
#     except:
#         temp_url.append(str(ord(char)))
#   return ''.join(temp_url)

# print(encrypt_url('www.google.com/123@!@$'))