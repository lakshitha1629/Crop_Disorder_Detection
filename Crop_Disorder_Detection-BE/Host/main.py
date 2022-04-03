from flask import Flask, request, redirect
from flask_restful import Resource, Api
from flask_cors import CORS
import os
from imageProcessing import detectionOutput

ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg']
UPLOAD_FOLDER = './upload'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
cors = CORS(app, resources={r"*": {"origins": "*"}})
api = Api(app)

def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class Test(Resource):
    def get(self):
        return 'Welcome to, Crop Disorder Detection API!'
    
    def post(self):
        try:
            value = request.get_json()
            if(value):
                return {'Post Values': value}, 201
            
            return {"error":"Invalid format."}
            
        except Exception as error:
            return {'error': error}

class GetDetectionOutput(Resource):
    def get(self):
        return {"error":"Invalid Method."}

    def post(self):
        file_to_upload = request.files['file']

        if file_to_upload.filename == '':
            print('No selected file')
            return redirect(request.url)

        if not allowed_file(file_to_upload.filename):
            return {"error":"Invalid image file format."}

        try:
            path = os.path.join(app.config['UPLOAD_FOLDER'], file_to_upload.filename)
            ProcessingFactor = 150
            file_to_upload.save(path)
            diseasePercentage, whiteDotsCount, yellowDotsCount = detectionOutput(path, ProcessingFactor)
            return {'diseasePercentage':diseasePercentage,
                    'whiteDotsCount':whiteDotsCount,
                    'yellowDotsCount':yellowDotsCount}

        except Exception as error:
            return {'error': error}

api.add_resource(Test,'/')
api.add_resource(GetDetectionOutput,'/getDetectionOutput')

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
