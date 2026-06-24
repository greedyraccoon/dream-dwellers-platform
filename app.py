import streamlit as st
import pandas as pd
import xgboost as xgb
import datetime

st.title("⚡ Energy Prediction App")
st.success("Model loaded successfully!")

# 1. Load the model (Your app is already doing this successfully!)
@st.cache_resource
def load_model():
    model = xgb.XGBRegressor()
    model.load_model("energy_xgboost_model.json")
    return model

model = load_model()

st.write("### Enter Input Details for Prediction:")

# 2. Add interactive input widgets for the user
date_input = st.date_input("Select Date", datetime.date.today())
time_input = st.time_input("Select Time", datetime.time(12, 00))
temperature = st.slider("Predicted Temperature (°C)", min_value=-10, max_value=45, value=25)

# 3. Process the inputs into the exact features the model expects
dt = datetime.datetime.combine(date_input, time_input)

features = pd.DataFrame([{
    'hour': dt.hour,
    'dayofweek': dt.weekday(),
    'quarter': (dt.month - 1) // 3 + 1,
    'month': dt.month,
    'year': dt.year,
    'dayofyear': dt.timetuple().tm_yday,
    'lag_24h': 15000,  # Placeholder historical data
    'lag_7d': 14800
}])

st.markdown("---")

# 4. Trigger the prediction when the button is clicked
if st.button("🔮 Forecast Energy Consumption"):
    prediction = model.predict(features)
   
    # Display the result beautifully
    st.metric(label="Predicted Power Load", value=f"{prediction[0]:,.2f} MW")