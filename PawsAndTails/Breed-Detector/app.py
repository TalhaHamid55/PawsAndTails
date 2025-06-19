# import streamlit as st
# import tensorflow as tf
# import numpy as np
# import gdown
# import os

# # --- Model download ---
# model_path = "dogclassification.h5"
# gdrive_url = "https://drive.google.com/uc?id=1p_7tKpD1bkv7rrh08lKYjbXOFc_jAniL"

# if not os.path.exists(model_path):
#     st.write("🔄 Downloading model... Please wait ⏳")
#     try:
#         gdown.download(gdrive_url, model_path, quiet=False)
#         st.success("✅ Model downloaded successfully!")
#     except Exception as e:
#         st.error("❌ Model download failed. Please check the URL or internet connection.")
#         st.stop()

# # --- Load model ---
# try:
#     model = tf.keras.models.load_model(model_path)
# except Exception as e:
#     st.error("❌ Failed to load model. Make sure the .h5 file is correct and compatible.")
#     st.exception(e)
#     st.stop()

# # --- Class labels ---
# class_names = {
#     "0": "Afghan", "1": "African Wild Dog", "2": "Airedale", "3": "American Hairless",
#     "4": "American Spaniel", "5": "Basenji", "6": "Basset", "7": "Beagle",
#     "8": "Bearded Collie", "9": "Bermaise", "10": "Bichon Frise", "11": "Blenheim",
#     "12": "Bloodhound", "13": "Bluetick", "14": "Border Collie", "15": "Borzoi",
#     "16": "Boston Terrier", "17": "Boxer", "18": "Bull Mastiff", "19": "Bull Terrier",
#     "20": "Bulldog", "21": "Cairn", "22": "Chihuahua", "23": "Chinese Crested",
#     "24": "Chow", "25": "Clumber", "26": "Cockapoo", "27": "Cocker", "28": "Collie",
#     "29": "Corgi", "30": "Coyote", "31": "Dalmation", "32": "Dhole", "33": "Dingo",
#     "34": "Doberman", "35": "Elk Hound", "36": "French Bulldog", "37": "German Sheperd",
#     "38": "Golden Retriever", "39": "Great Dane", "40": "Great Perenees", "41": "Greyhound",
#     "42": "Groenendael", "43": "Irish Spaniel", "44": "Irish Wolfhound",
#     "45": "Japanese Spaniel", "46": "Komondor", "47": "Labradoodle", "48": "Labrador",
#     "49": "Lhasa", "50": "Malinois", "51": "Maltese", "52": "Mex Hairless",
#     "53": "Newfoundland", "54": "Pekinese", "55": "Pit Bull", "56": "Pomeranian",
#     "57": "Poodle", "58": "Pug", "59": "Rhodesian", "60": "Rottweiler",
#     "61": "Saint Bernard", "62": "Schnauzer", "63": "Scotch Terrier", "64": "Shar_Pei",
#     "65": "Shiba Inu", "66": "Shih-Tzu", "67": "Siberian Husky", "68": "Vizsla", "69": "Yorkie"
# }

# # --- UI ---
# st.title("🐶 Dog Breed Detection App")

# uploaded_image = st.file_uploader("Upload a dog image", type=["jpg", "jpeg", "png"])

# if uploaded_image is not None:
#     img_data = uploaded_image.read()
#     img = tf.image.decode_image(img_data, channels=3)
#     img = tf.image.resize(img, (224, 224))
#     img = tf.expand_dims(img, 0) / 255.0

#     st.image(img[0].numpy(), caption="Uploaded Image", use_column_width=True)

#     if st.button("Classify"):
#         prediction = model.predict(img)
#         predicted_class = np.argmax(prediction, axis=-1)
#         breed = class_names.get(str(predicted_class[0]), "Unknown")
#         st.success(f"🎯 Predicted Breed: **{breed}**")

from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import tensorflow as tf
import numpy as np
import gdown
import os
import io
import base64


app = Flask(__name__)
CORS(app) 

# --- Download model if needed ---
model_path = "dogclassification.h5"
gdrive_url = "https://drive.google.com/uc?id=1p_7tKpD1bkv7rrh08lKYjbXOFc_jAniL"

if not os.path.exists(model_path):
    print("Downloading model...")
    gdown.download(gdrive_url, model_path, quiet=False)

# --- Load model ---
model = tf.keras.models.load_model(model_path)

# --- Class labels ---
class_names = {
    "0": "Afghan", "1": "African Wild Dog", "2": "Airedale", "3": "American Hairless",
    "4": "American Spaniel", "5": "Basenji", "6": "Basset", "7": "Beagle",
    "8": "Bearded Collie", "9": "Bermaise", "10": "Bichon Frise", "11": "Blenheim",
    "12": "Bloodhound", "13": "Bluetick", "14": "Border Collie", "15": "Borzoi",
    "16": "Boston Terrier", "17": "Boxer", "18": "Bull Mastiff", "19": "Bull Terrier",
    "20": "Bulldog", "21": "Cairn", "22": "Chihuahua", "23": "Chinese Crested",
    "24": "Chow", "25": "Clumber", "26": "Cockapoo", "27": "Cocker", "28": "Collie",
    "29": "Corgi", "30": "Coyote", "31": "Dalmation", "32": "Dhole", "33": "Dingo",
    "34": "Doberman", "35": "Elk Hound", "36": "French Bulldog", "37": "German Sheperd",
    "38": "Golden Retriever", "39": "Great Dane", "40": "Great Perenees", "41": "Greyhound",
    "42": "Groenendael", "43": "Irish Spaniel", "44": "Irish Wolfhound",
    "45": "Japanese Spaniel", "46": "Komondor", "47": "Labradoodle", "48": "Labrador",
    "49": "Lhasa", "50": "Malinois", "51": "Maltese", "52": "Mex Hairless",
    "53": "Newfoundland", "54": "Pekinese", "55": "Pit Bull", "56": "Pomeranian",
    "57": "Poodle", "58": "Pug", "59": "Rhodesian", "60": "Rottweiler",
    "61": "Saint Bernard", "62": "Schnauzer", "63": "Scotch Terrier", "64": "Shar_Pei",
    "65": "Shiba Inu", "66": "Shih-Tzu", "67": "Siberian Husky", "68": "Vizsla", "69": "Yorkie"
}

# --- Predict route ---
@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Accept either base64 or file
        if "image" in request.files:
            file = request.files["image"]
            img = Image.open(file.stream).convert("RGB")
        elif request.json and "image" in request.json:
            img_data = request.json["image"]
            base64_data = img_data.split(",")[1] if "," in img_data else img_data
            image_bytes = base64.b64decode(base64_data)
            img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        else:
            return jsonify({"error": "No image provided"}), 400

        # Preprocess image
        img = img.resize((224, 224))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Predict
        predictions = model.predict(img_array)
        predicted_class = np.argmax(predictions, axis=-1)[0]
        breed = class_names.get(str(predicted_class), "Unknown")

        return jsonify({"breed": breed})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5600, debug=True)
