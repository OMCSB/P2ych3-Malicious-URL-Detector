import dock_utils.url_loader as url_loader
import sys
import pandas as pd
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
import  time

# Needs tensoflow 2.10.1
# Needs Python 3.5-3.7

import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

app = Flask(__name__)
CORS(app, supports_credentials=True)
lstm_model = tf.keras.models.load_model('LSTM_Model_V2_pytf/lstmv2_model.h5')

df = pd.read_csv('./data/balanced_urls.csv')

def fit_tokens(url):
    txt = [url_loader.tokenize_url_regex(word) for word in df['url']]
    df['tokenized_url'] = txt
    max_url_len = 60
    tok = Tokenizer()
    tok.fit_on_texts(df['tokenized_url'])
    tokenized_url = url_loader.tokenize_url_regex(url)
    encd_rev = tok.texts_to_sequences(tokenized_url)
    encd_revs = [[item for sublist in encd_rev for item in sublist]]
    pad_rev=pad_sequences(encd_revs, maxlen=max_url_len, padding="post")
    return pad_rev

result = []
requests = []

@app.route('/get_events')
def get_events():
    return jsonify(requests)

@app.route('/get_url')
def get_url():
    return jsonify(result)

@app.route('/send_events', methods=['POST'])
def send_events():
    event_json = request.get_json()
    save = {
        "Timestamp": event_json['Timestamp'],
        "URL": event_json['URL'],
        "Method": event_json['Method'],
        "Header": event_json['Header']
    }
    requests.append
    return '', 204

@app.route('/detect_url', methods=['POST'])
def detect_url():
    start_time = time.time()
    
    req_json = request.get_json()
    tokening = fit_tokens(req_json['url'])
    
    ones, nones = 0, 0
    for _ in range(25):
        predicted = lstm_model.predict(tokening).round()
        if predicted == 1:
            ones += 1
        else:
            nones += 1
        
    if ones > nones:
        end_time = time.time()
        out = {
            "result": "Malicious",
            "chance": ones*4,
            "time_taken": end_time-start_time,
            "sesh_token": req_json['tokens']
        }
        result.append(out)
        return '', 204
    else:
        end_time = time.time()
        out = {
            "result": "Benign",
            "chance": nones*4,
            "time_taken": end_time-start_time,
            "sesh_token": req_json['tokens']
        }
        result.append(out)
        return '', 204
