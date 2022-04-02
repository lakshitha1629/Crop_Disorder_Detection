from flask import Flask, request, redirect
from flask_restful import Resource, Api
import os
import prediction

app = Flask(__name__)
api = Api(app)

class Test(Resource):
    def get(self):
        return 'Welcome to, NITAGMA API!'
    
    def post(self):
        try:
            value = request.get_json()
            if(value):
                return {'Post Values': value}, 201
            
            return {"error":"Invalid format."}
            
        except Exception as error:
            return {'error': error}

class GetPrediction(Resource):
    def get(self):
        return {"error":"Invalid Method."}

    def post(self):
        try:
            data = request.get_json()
            # print(data)
            predict = prediction.predict_Output(data)
            return {'predict':predict}

        except Exception as error:
            return {'error': error}

api.add_resource(Test,'/')
api.add_resource(GetPrediction,'/getPrediction')

# if __name__ == '__main__':
#     app.run(debug=True)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
