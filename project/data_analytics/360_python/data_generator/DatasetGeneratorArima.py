#%matplotlib inline
from __future__ import print_function
import csv
import random
import pandas
from datetime import datetime
from datetime import timedelta
import numpy as np
import statsmodels.api as sm
import pandas as pd
from statsmodels.tsa.arima_process import arma_generate_sample

np.random.seed(12345)

arparams = np.array([.75, -.25])
maparams = np.array([.65, .35])

arparams = np.r_[1, -arparams]
maparams = np.r_[1, maparams]
nobs = 250
y = arma_generate_sample(arparams, maparams, nobs)

dates = sm.tsa.datetools.dates_from_range('1980m1', length=nobs)
y = pd.Series(y, index=dates)
arma_mod = sm.tsa.ARMA(y, order=(2,2))
arma_res = arma_mod.fit(trend='nc', disp=-1)

print(arma_res.summary())

print(y.tail())
