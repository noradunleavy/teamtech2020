import clean_sample
from fbprophet import Prophet
import pandas as pd
import datetime as dt
import matplotlib.pyplot as plt
from fbprophet.plot import plot_plotly
from sklearn.preprocessing import LabelEncoder
from scipy.io import arff
import plotly.offline as py

def createForecastingDF(forcasting_var,df):
    index = df.columns.get_loc(forcasting_var)
    all_cols = list(df.columns[1:index]) + list(df.columns[index + 1:])
    regressor_cols = all_cols[2:]
    regressors = df[regressor_cols]
    X = df[all_cols]
    X['y'] = df[forcasting_var]
    return X, regressors

def fit_predict_model(dataframe,regressors, interval_width = 0.99, changepoint_range = 0.8):
    model = Prophet()
    for regressor in regressors:
        model.add_regressor(regressor)
    model = model.fit(dataframe)
    forecast = model.predict(dataframe)
    forecast['fact'] = dataframe['y'].reset_index(drop = True)
    return forecast, model

def detect_anomalies(forecast):
    forecasted = forecast[['ds','trend', 'yhat', 'yhat_lower', 'yhat_upper', 'fact']].copy()
    
    #Checks for places where forcasted data is not in the bounds
    forecasted['anomaly'] = 0

    forecasted.loc[forecasted['fact'] > forecasted['yhat_upper'], 'anomaly'] = 1
    forecasted.loc[forecasted['fact'] < forecasted['yhat_lower'], 'anomaly'] = -1

    return forecasted

def getDfFromAnomalies(df,forecastingVar):
    anomalies = pd.DataFrame(columns=["Timestamp", "Category","Type"])
    for index,row in df.loc[df['anomaly'] == -1].iterrows():
        anomalies = anomalies.append({"Timestamp": row["ds"], "Category":forecastingVar, "Type": -1},
                                     ignore_index=True)
    for index,row in df.loc[df['anomaly'] == 1].iterrows():
        anomalies.append({"Timestamp": row["ds"], "Category":forecastingVar, "Type": 1},
                        ignore_index=True)
    return anomalies

def DetectAnomalies(UUID):
    #Detects all anomalies in each category
    df = clean_sample.get_dataframe(UUID)
    models = []
    allAnomalies = pd.DataFrame()
    df['anomaly'] = 0
    for category in df.columns[4:]:
        if category == 'anomaly':
            continue
        forecastingDF, regressors = createForecastingDF(category, df)
        pred, m = fit_predict_model(forecastingDF, regressors)
        models.append(m)
        forecasted = detect_anomalies(pred)
        allAnomalies = allAnomalies.append(getDfFromAnomalies(forecasted, category))
    allAnomalies = allAnomalies.sort_values(by='Timestamp')
    return allAnomalies