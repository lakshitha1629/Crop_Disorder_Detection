import pickle
import pandas as pd

def predict_mpg(config):
    ##loading the model from the saved file
    pkl_filename = "model.pkl"
    with open(pkl_filename, 'rb') as f_in:
        model = pickle.load(f_in)

    if type(config) == dict:
        df = pd.DataFrame(my_pickled_object)
    else:
        df = config
    
    y_pred = model.predict(df)

    return y_pred

