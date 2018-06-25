from flask import Flask, render_template, make_response
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
import numpy as np
import pandas as pd
from sklearn.cross_validation import train_test_split
from sklearn.linear_model import LinearRegression
import io
app = Flask(__name__,static_folder='public')

@app.route('/')
def index():
    dataset =pd.read_csv('Salary_Data.csv')
    x=dataset.iloc[:,:-1].values
    y=dataset.iloc[:,1].values
    X_train, X_test, Y_train, Y_test=train_test_split(x,y,test_size=1/3,random_state=0)
    regressor = LinearRegression()
    regressor.fit(X_train,Y_train)
    fig = Figure()
    axis = fig.add_subplot(1, 1, 1)

    axis.scatter(X_train,Y_train,color='red')
    axis.plot(X_train,regressor.predict(X_train),color='blue')
    axis.set_title('asd')
    canvas = FigureCanvas(fig)
    output = io.BytesIO()
    canvas.print_png(output)
    response = make_response(output.getvalue())
    response.mimetype = 'image/png'
    return response

@app.route('/home')
def home():
    return render_template('home.html')
@app.route('/show')
def showGraph():
    return render_template('show.html')
if __name__ == '__main__':
    app.run(debug=True)
