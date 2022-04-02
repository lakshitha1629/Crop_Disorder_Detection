import pickle
import pandas as pd
import json

def predict_mpg(config):
    ##loading the model from the saved file
    pkl_filename = "model.pkl"
    with open(pkl_filename, 'rb') as f_in:
        model = pickle.load(f_in)
    
    if (config):
        df = pd.DataFrame(config)
        
    else:
        df = config
    
    y_pred = model.predict(df)
    y_pred_int = int(y_pred[0])
    return y_pred_int


def predict_Output(y):
    result = []
    valueList={}
    for key in y:
        valueList.update({key: y[str(key)].split(',')})

    for i in range(0, len(valueList["Collar_bone_x"])):
        my_list = [elem[i] for elem in valueList.values()]
        
        for a in range(0, len(my_list)):
            config = {
                'Collar_bone_x': [my_list[a]],
                'Collar_bone_y': [my_list[a]],
                'Collar_bone_z': [my_list[a]],
                'Fore_arm_x': [my_list[a]],
                'Fore_arm_y': [my_list[a]],
                'Fore_arm_z': [my_list[a]],
                'Hand_x_test': [my_list[a]],
                'Hand_y_test': [my_list[a]],
                'Hand_z_test': [my_list[a]],
                'Upper_arm_x': [my_list[a]],
                'Upper_arm_y': [my_list[a]],
                'Upper_arm_z': [my_list[a]]
                }
        predictResult = predict_mpg(config)
        result.append(predictResult)
    #     print(config)

    most_common_value = max(result, key = result.count)
    # print(most_common_value,"MaxCoutOutput")
    return most_common_value

