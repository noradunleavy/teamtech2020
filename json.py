import pandas as pd
import numpy as np

# Issue with DataFrame, but should work with data retrieved from MongoDB

def convertToJSON(UUID):
  #here would be the get dataframe call, parameter UUID
  data = np.array([['5/21 @3:00PM', '5/21 @4:00PM', '5/22 @2:22PM'],
                 ['PRODUCTIVITY', 'SOCIALMEDIA', 'WEATHER'], [-1, 1, 1]])
  data = data.T
  user_frame = pd.DataFrame(data, columns=['TimeStamp', 'Category', 'Type'])
  json = user_frame.to_json(orient='records')
  d_json = {'Anomalies': json}  
  return d_json  

# for testing
# print(convertToJSON('eb20b8'))