from flask import Flask,request, render_template,send_file
import os
import base64
from keras.models import model_from_json
from keras.preprocessing import image
from keras import backend as K
import cv2
import numpy as np

app=Flask(__name__,static_folder='public')
UPLOAD_FOLDER = os.path.basename('uploads')
app.config['UPLOAD_FOLDER']= UPLOAD_FOLDER

emotions = ('angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral')
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

@app.route('/',methods=['GET'])
def index():
	return render_template('index.html')

@app.route('/upload', methods=['POST'])
def compute():
	file = request.files['image']
	f=os.path.join(app.config['UPLOAD_FOLDER'],file.filename)
	file.save(f)
	model = model_from_json(open("facial_expression_model_structure_adarsh_dot_online.json", "r").read())
	model.load_weights('facial_expression_model_weights_adarsh_dot_online.h5')
	print("Loaded Model from disk")
	print(file.filename)
	colorimg=cv2.imread(f,-1)
	img=cv2.imread(f,0)
	faces = face_cascade.detectMultiScale(img, 1.3, 5)
	for (x,y,w,h) in faces:
		detected_face = img[int(y):int(y+h), int(x):int(x+w)]
		detected_face = cv2.resize(detected_face, (48, 48))
		img_pixels = image.img_to_array(detected_face)
		img_pixels = np.expand_dims(img_pixels, axis = 0)
		img_pixels /= 255
		predictions = model.predict(img_pixels)
		max_index = np.argmax(predictions[0])
		emotion = emotions[max_index]
		cv2.rectangle(colorimg,(x,y),(x+w,y+h),(255,0,0),2)
		cv2.putText(colorimg, emotion, (int(x), int(y)), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 2)
		#cv2.imwrite(f,img)
		qq,aa=cv2.imencode('.jpeg',colorimg)
		aa=base64.b64encode(aa)
	K.clear_session()
	try:
		emotion
	except NameError:
		return aa
	else:
		return aa

if __name__ == '__main__':
	app.run(debug=True)
