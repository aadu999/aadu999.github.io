from flask import Flask, render_template, make_response
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
import numpy as np
import random
import io
import pandas as pd
from sklearn.cross_validation import train_test_split
from sklearn.linear_model import LinearRegression
app = Flask(__name__,static_folder='public')

@app.route('/show')
def showgraph():
    return render_template('show_graph.html')

@app.route('/compute')
def compute():
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

@app.route('/')
def index():
    return render_template('layout.html')

if __name__ == '__main__':
    app.run()
