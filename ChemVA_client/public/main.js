var run3D = true;

var data;

// var testSDF = `185\n OpenBabel03302020353D\n\n168171  0  0  1  0  0  0  0  0999 V2000\n   20.3757    4.3481    2.9440 C   0  0  0  0  0  0  0  0  0  0  0  0\n   19.1494    3.4088    3.0755 C   0  0  0  0  0  0  0  0  0  0  0  0\n   18.5573    2.7016    1.7639 C   0  0  1  0  0  0  0  0  0  0  0  0\n   19.7985    2.8340    0.7587 C   0  0  0  0  0  0  0  0  0  0  0  0\n   17.9737    1.1916    2.2631 C   0  0  1  0  0  0  0  0  0  0  0  0\n   16.7329    0.0268    1.7230 N   0  0  0  0  0  0  0  0  0  0  0  0\n   14.8820   -0.6369    1.8105 C   0  0  0  0  0  0  0  0  0  0  0  0\n   13.8641   -0.1752    2.4394 O   0  0  0  0  0  0  0  0  0  0  0  0\n   14.2378   -2.2389    1.0271 C   0  0  2  0  0  0  0  0  0  0  0  0\n   14.5579   -3.1413   -0.2185 C   0  0  0  0  0  0  0  0  0  0  0  0\n   13.6041   -2.7056   -1.3261 C   0  0  0  0  0  0  0  0  0  0  0  0\n   12.5517   -1.8690   -0.6035 C   0  0  0  0  0  0  0  0  0  0  0  0\n   12.8166   -2.0806    0.7973 N   0  0  0  0  0  0  0  0  0  0  0  0\n   11.8579   -2.0941    1.7753 C   0  0  0  0  0  0  0  0  0  0  0  0\n   10.8324   -1.3821    1.6414 O   0  0  0  0  0  0  0  0  0  0  0  0\n   12.0184   -3.1283    2.9373 C   0  0  2  0  0  0  0  0  0  0  0  0\n   10.6711   -3.3927    3.6458 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.7224   -4.1528    2.7434 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.8317   -5.5417    2.6089 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.0710   -6.2146    1.6530 C   0  0  0  0  0  0  0  0  0  0  0  0\n    8.2088   -5.5068    0.8162 C   0  0  0  0  0  0  0  0  0  0  0  0\n    8.0784   -4.1287    0.9572 C   0  0  0  0  0  0  0  0  0  0  0  0\n    8.8145   -3.4601    1.9315 C   0  0  0  0  0  0  0  0  0  0  0  0\n   13.0999   -2.8296    3.9118 N   0  0  0  0  0  0  0  0  0  0  0  0\n   12.8783   -1.6986    4.8039 C   0  0  0  0  0  0  0  0  0  0  0  0\n   14.1799   -3.7050    3.9948 C   0  0  0  0  0  0  0  0  0  0  0  0\n   14.2376   -4.7238    3.3006 O   0  0  0  0  0  0  0  0  0  0  0  0\n   15.3784   -3.3590    4.8730 C   0  0  2  0  0  0  0  0  0  0  0  0\n   16.5413   -2.6947    4.0855 C   0  0  0  0  0  0  0  0  0  0  0  0\n   16.3250   -1.5430    3.0615 C   0  0  0  0  0  0  0  0  0  0  0  0\n   15.8274    0.1235    3.5707 C   0  0  0  0  0  0  0  0  0  0  0  0\n   15.3640    1.3945    2.3204 C   0  0  0  0  0  0  0  0  0  0  0  0\n   15.3690    0.9766    0.5533 C   0  0  0  0  0  0  0  0  0  0  0  0\n   15.8944   -0.6843    0.0250 C   0  0  0  0  0  0  0  0  0  0  0  0\n   16.4442   -1.9196    1.3056 C   0  0  0  0  0  0  0  0  0  0  0  0\n   15.7797   -4.5423    5.7176 N   0  0  0  0  0  0  0  0  0  0  0  0\n   16.2289   -5.8226    5.6054 C   0  0  0  0  0  0  0  0  0  0  0  0\n   16.6228   -6.2686    6.6986 O   0  0  0  0  0  0  0  0  0  0  0  0\n   16.2405   -6.7518    4.3274 C   0  0  2  0  0  0  0  0  0  0  0  0\n   15.0481   -7.7661    4.2033 C   0  0  0  0  0  0  0  0  0  0  0  0\n   15.0383   -8.4399    2.8177 C   0  0  0  0  0  0  0  0  0  0  0  0\n   13.6457   -7.2441    4.5034 C   0  0  0  0  0  0  0  0  0  0  0  0\n   17.5309   -7.5838    4.3273 N   0  0  0  0  0  0  0  0  0  0  0  0\n   17.7411   -8.5184    5.4255 C   0  0  0  0  0  0  0  0  0  0  0  0\n   18.2900   -7.6661    3.1582 C   0  0  0  0  0  0  0  0  0  0  0  0\n   17.8879   -7.0652    2.1560 O   0  0  0  0  0  0  0  0  0  0  0  0\n   19.7715   -8.2677    3.2018 C   0  0  1  0  0  0  0  0  0  0  0  0\n   20.2353   -9.6104    3.8482 C   0  0  1  0  0  0  0  0  0  0  0  0\n   19.4416  -10.8555    3.4650 C   0  0  0  0  0  0  0  0  0  0  0  0\n   21.7644   -9.8397    3.6491 C   0  0  0  0  0  0  0  0  0  0  0  0\n   22.4107  -10.6477    4.7644 C   0  0  0  0  0  0  0  0  0  0  0  0\n   20.6905   -7.9206    2.1267 O   0  0  0  0  0  0  0  0  0  0  0  0\n   20.2725   -7.3734    0.9607 C   0  0  0  0  0  0  0  0  0  0  0  0\n   19.4504   -7.9308    0.2419 O   0  0  0  0  0  0  0  0  0  0  0  0\n   21.0912   -6.0702    0.6119 C   0  0  0  0  0  0  0  0  0  0  0  0\n   21.7677   -5.4163    1.6244 C   0  0  0  0  0  0  0  0  0  0  0  0\n   22.6263   -4.1736    1.5290 C   0  0  0  0  0  0  0  0  0  0  0  0\n   21.6157   -5.7320    3.1068 C   0  0  0  0  0  0  0  0  0  0  0  0\n   20.9554   -5.5483   -0.7304 N   0  0  0  0  0  0  0  0  0  0  0  0\n   19.9469   -6.1253   -1.6322 C   0  0  0  0  0  0  0  0  0  0  0  0\n   21.6685   -4.4276   -1.2256 C   0  0  0  0  0  0  0  0  0  0  0  0\n   22.8974   -4.3531   -1.1703 O   0  0  0  0  0  0  0  0  0  0  0  0\n   20.8445   -3.3804   -2.0501 C   0  0  2  0  0  0  0  0  0  0  0  0\n   21.3860   -1.9732   -2.3604 C   0  0  0  0  0  0  0  0  0  0  0  0\n   22.7662   -1.8604   -2.9900 C   0  0  0  0  0  0  0  0  0  0  0  0\n   22.7973   -2.5111   -4.3645 C   0  0  0  0  0  0  0  0  0  0  0  0\n   23.1573   -0.3799   -3.0720 C   0  0  0  0  0  0  0  0  0  0  0  0\n   19.4995   -3.2774   -1.5187 N   0  0  0  0  0  0  0  0  0  0  0  0\n   18.9640   -2.3046   -0.7718 C   0  0  0  0  0  0  0  0  0  0  0  0\n   17.8246   -2.0797   -1.1938 O   0  0  0  0  0  0  0  0  0  0  0  0\n   19.6345   -1.5462    0.4455 C   0  0  2  0  0  0  0  0  0  0  0  0\n   19.7728   -2.3864    1.7997 C   0  0  0  0  0  0  0  0  0  0  0  0\n   19.1260   -3.7539    1.7692 C   0  0  0  0  0  0  0  0  0  0  0  0\n   19.6102   -1.8522    3.2509 C   0  0  0  0  0  0  0  0  0  0  0  0\n   18.9533   -0.2527    0.5675 N   0  0  0  0  0  0  0  0  0  0  0  0\n   18.5684    0.5098   -0.6624 C   0  0  0  0  0  0  0  0  0  0  0  0\n   19.1981    0.4311    1.7590 C   0  0  0  0  0  0  0  0  0  0  0  0\n   20.3033    0.4976    2.2808 O   0  0  0  0  0  0  0  0  0  0  0  0\n   20.5512    4.8922    3.8766 H   0  0  0  0  0  0  0  0  0  0  0  0\n   20.2623    5.0915    2.1492 H   0  0  0  0  0  0  0  0  0  0  0  0\n   21.3031    3.7860    2.7588 H   0  0  0  0  0  0  0  0  0  0  0  0\n   18.3416    3.9639    3.5581 H   0  0  0  0  0  0  0  0  0  0  0  0\n   19.4720    2.6336    3.7821 H   0  0  0  0  0  0  0  0  0  0  0  0\n   17.7302    3.2978    1.3682 H   0  0  0  0  0  0  0  0  0  0  0  0\n   20.7446    2.5068    1.2127 H   0  0  0  0  0  0  0  0  0  0  0  0\n   19.9411    3.8753    0.4531 H   0  0  0  0  0  0  0  0  0  0  0  0\n   19.7824    2.3201   -0.1887 H   0  0  0  0  0  0  0  0  0  0  0  0\n   17.9428    1.1539    3.3570 H   0  0  0  0  0  0  0  0  0  0  0  0\n   17.3879   -0.4152    1.0864 H   0  0  0  0  0  0  0  0  0  0  0  0\n   14.3506   -2.9295    1.8634 H   0  0  0  0  0  0  0  0  0  0  0  0\n   14.2911   -4.1768    0.0436 H   0  0  0  0  0  0  0  0  0  0  0  0\n   15.5731   -3.2267   -0.6024 H   0  0  0  0  0  0  0  0  0  0  0  0\n   13.1701   -3.5875   -1.8151 H   0  0  0  0  0  0  0  0  0  0  0  0\n   14.1218   -2.1364   -2.1052 H   0  0  0  0  0  0  0  0  0  0  0  0\n   11.5379   -2.1687   -0.8774 H   0  0  0  0  0  0  0  0  0  0  0  0\n   12.6992   -0.8097   -0.8279 H   0  0  0  0  0  0  0  0  0  0  0  0\n   12.2859   -4.0593    2.4191 H   0  0  0  0  0  0  0  0  0  0  0  0\n   10.8349   -3.9842    4.5568 H   0  0  0  0  0  0  0  0  0  0  0  0\n   10.2087   -2.4540    3.9755 H   0  0  0  0  0  0  0  0  0  0  0  0\n   10.5341   -6.1009    3.2232 H   0  0  0  0  0  0  0  0  0  0  0  0\n    9.1717   -7.2911    1.5413 H   0  0  0  0  0  0  0  0  0  0  0  0\n    7.6442   -6.0261    0.0479 H   0  0  0  0  0  0  0  0  0  0  0  0\n    7.4262   -3.5641    0.2968 H   0  0  0  0  0  0  0  0  0  0  0  0\n    8.7179   -2.3783    2.0101 H   0  0  0  0  0  0  0  0  0  0  0  0\n   12.2161   -0.9664    4.3381 H   0  0  0  0  0  0  0  0  0  0  0  0\n   13.8107   -1.1996    5.0643 H   0  0  0  0  0  0  0  0  0  0  0  0\n   12.4180   -2.0781    5.7204 H   0  0  0  0  0  0  0  0  0  0  0  0\n   15.0628   -2.6453    5.6368 H   0  0  0  0  0  0  0  0  0  0  0  0\n   17.2677   -2.3291    4.8217 H   0  0  0  0  0  0  0  0  0  0  0  0\n   17.0413   -3.5076    3.5647 H   0  0  0  0  0  0  0  0  0  0  0  0\n   15.6962    0.3623    4.6243 H   0  0  0  0  0  0  0  0  0  0  0  0\n   14.9417    2.3354    2.6428 H   0  0  0  0  0  0  0  0  0  0  0  0\n   14.9795    1.6683   -0.1841 H   0  0  0  0  0  0  0  0  0  0  0  0\n   15.8595   -0.9394   -1.0299 H   0  0  0  0  0  0  0  0  0  0  0  0\n   16.7351   -2.9186    0.9754 H   0  0  0  0  0  0  0  0  0  0  0  0\n   15.9073   -4.2852    6.6897 H   0  0  0  0  0  0  0  0  0  0  0  0\n   16.2627   -6.0855    3.4606 H   0  0  0  0  0  0  0  0  0  0  0  0\n   15.2015   -8.5699    4.9331 H   0  0  0  0  0  0  0  0  0  0  0  0\n   15.0135   -7.6947    2.0150 H   0  0  0  0  0  0  0  0  0  0  0  0\n   14.1646   -9.0903    2.6995 H   0  0  0  0  0  0  0  0  0  0  0  0\n   15.9214   -9.0702    2.6710 H   0  0  0  0  0  0  0  0  0  0  0  0\n   13.1967   -6.7488    3.6394 H   0  0  0  0  0  0  0  0  0  0  0  0\n   13.6248   -6.5769    5.3671 H   0  0  0  0  0  0  0  0  0  0  0  0\n   12.9860   -8.0903    4.7339 H   0  0  0  0  0  0  0  0  0  0  0  0\n   16.9571   -8.4701    6.1804 H   0  0  0  0  0  0  0  0  0  0  0  0\n   18.6971   -8.3017    5.9031 H   0  0  0  0  0  0  0  0  0  0  0  0\n   17.7262   -9.5356    5.0290 H   0  0  0  0  0  0  0  0  0  0  0  0\n   20.1388   -7.6100    4.0019 H   0  0  0  0  0  0  0  0  0  0  0  0\n   20.1003   -9.4954    4.9293 H   0  0  0  0  0  0  0  0  0  0  0  0\n   19.9440  -11.4589    2.7038 H   0  0  0  0  0  0  0  0  0  0  0  0\n   18.4350  -10.6175    3.1136 H   0  0  0  0  0  0  0  0  0  0  0  0\n   19.3342  -11.4938    4.3530 H   0  0  0  0  0  0  0  0  0  0  0  0\n   22.2935   -8.8804    3.6280 H   0  0  0  0  0  0  0  0  0  0  0  0\n   21.9567  -10.3237    2.6834 H   0  0  0  0  0  0  0  0  0  0  0  0\n   22.3024  -10.1305    5.7238 H   0  0  0  0  0  0  0  0  0  0  0  0\n   23.4836  -10.7562    4.5708 H   0  0  0  0  0  0  0  0  0  0  0  0\n   21.9739  -11.6450    4.8505 H   0  0  0  0  0  0  0  0  0  0  0  0\n   22.2633   -3.4420    0.8132 H   0  0  0  0  0  0  0  0  0  0  0  0\n   23.6623   -4.4374    1.3150 H   0  0  0  0  0  0  0  0  0  0  0  0\n   22.6353   -3.6097    2.4713 H   0  0  0  0  0  0  0  0  0  0  0  0\n   20.5627   -5.8652    3.3518 H   0  0  0  0  0  0  0  0  0  0  0  0\n   21.8861   -4.9023    3.7682 H   0  0  0  0  0  0  0  0  0  0  0  0\n   22.2248   -6.5834    3.4098 H   0  0  0  0  0  0  0  0  0  0  0  0\n   20.0643   -7.2037   -1.7286 H   0  0  0  0  0  0  0  0  0  0  0  0\n   20.0726   -5.7565   -2.6541 H   0  0  0  0  0  0  0  0  0  0  0  0\n   18.9414   -5.8531   -1.2909 H   0  0  0  0  0  0  0  0  0  0  0  0\n   20.6989   -3.8471   -3.0307 H   0  0  0  0  0  0  0  0  0  0  0  0\n   20.6558   -1.4738   -3.0211 H   0  0  0  0  0  0  0  0  0  0  0  0\n   21.4128   -1.3546   -1.4699 H   0  0  0  0  0  0  0  0  0  0  0  0\n   23.4974   -2.3475   -2.3398 H   0  0  0  0  0  0  0  0  0  0  0  0\n   22.0825   -2.0342   -5.0442 H   0  0  0  0  0  0  0  0  0  0  0  0\n   22.5461   -3.5742   -4.3018 H   0  0  0  0  0  0  0  0  0  0  0  0\n   23.7954   -2.4311   -4.8018 H   0  0  0  0  0  0  0  0  0  0  0  0\n   22.4635    0.1880   -3.7018 H   0  0  0  0  0  0  0  0  0  0  0  0\n   24.1656   -0.2689   -3.4793 H   0  0  0  0  0  0  0  0  0  0  0  0\n   23.1500    0.0789   -2.0753 H   0  0  0  0  0  0  0  0  0  0  0  0\n   18.7783   -3.5483   -2.1798 H   0  0  0  0  0  0  0  0  0  0  0  0\n   20.6511   -1.2596    0.1888 H   0  0  0  0  0  0  0  0  0  0  0  0\n   20.8417   -2.5581    1.8098 H   0  0  0  0  0  0  0  0  0  0  0  0\n   18.0668   -3.7549    1.9418 H   0  0  0  0  0  0  0  0  0  0  0  0\n   19.5128   -4.3482    2.5899 H   0  0  0  0  0  0  0  0  0  0  0  0\n   19.2908   -4.2732    0.8373 H   0  0  0  0  0  0  0  0  0  0  0  0\n   18.7462   -1.2157    3.4105 H   0  0  0  0  0  0  0  0  0  0  0  0\n   20.4990   -1.3108    3.5938 H   0  0  0  0  0  0  0  0  0  0  0  0\n   19.5119   -2.6698    3.9750 H   0  0  0  0  0  0  0  0  0  0  0  0\n   17.7978    0.0504   -1.2678 H   0  0  0  0  0  0  0  0  0  0  0  0\n   19.4410    0.6443   -1.3049 H   0  0  0  0  0  0  0  0  0  0  0  0\n   18.1110    1.4718   -0.4101 H   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  1 79  1  0  0  0  0\n  1 80  1  0  0  0  0\n  1 81  1  0  0  0  0\n  2 82  1  0  0  0  0\n  2 83  1  0  0  0  0\n  3  4  1  0  0  0  0\n  3  2  1  0  0  0  0\n  3 84  1  6  0  0  0\n  4 85  1  0  0  0  0\n  4 86  1  0  0  0  0\n  4 87  1  0  0  0  0\n  5  6  1  0  0  0  0\n  5 77  1  0  0  0  0\n  5  3  1  0  0  0  0\n  5 88  1  1  0  0  0\n  6  7  1  0  0  0  0\n  6 89  1  0  0  0  0\n  7  8  2  0  0  0  0\n  7  9  1  0  0  0  0\n  9 10  1  0  0  0  0\n  9 13  1  0  0  0  0\n  9 90  1  1  0  0  0\n 10 11  1  0  0  0  0\n 10 91  1  0  0  0  0\n 10 92  1  0  0  0  0\n 11 12  1  0  0  0  0\n 11 93  1  0  0  0  0\n 11 94  1  0  0  0  0\n 12 13  1  0  0  0  0\n 12 95  1  0  0  0  0\n 12 96  1  0  0  0  0\n 13 14  1  0  0  0  0\n 14 15  2  0  0  0  0\n 14 16  1  0  0  0  0\n 16 24  1  0  0  0  0\n 16 17  1  0  0  0  0\n 16 97  1  6  0  0  0\n 17 18  1  0  0  0  0\n 17 98  1  0  0  0  0\n 17 99  1  0  0  0  0\n 18 19  1  0  0  0  0\n 18 23  2  0  0  0  0\n 19 20  2  0  0  0  0\n 19100  1  0  0  0  0\n 20 21  1  0  0  0  0\n 20101  1  0  0  0  0\n 21 22  2  0  0  0  0\n 21102  1  0  0  0  0\n 22 23  1  0  0  0  0\n 22103  1  0  0  0  0\n 23104  1  0  0  0  0\n 24 25  1  0  0  0  0\n 24 26  1  0  0  0  0\n 25105  1  0  0  0  0\n 25106  1  0  0  0  0\n 25107  1  0  0  0  0\n 26 27  2  0  0  0  0\n 26 28  1  0  0  0  0\n 28 36  1  0  0  0  0\n 28 29  1  0  0  0  0\n 28108  1  1  0  0  0\n 29 30  1  0  0  0  0\n 29109  1  0  0  0  0\n 29110  1  0  0  0  0\n 30 31  1  0  0  0  0\n 30 35  2  0  0  0  0\n 31 32  2  0  0  0  0\n 31111  1  0  0  0  0\n 32 33  1  0  0  0  0\n 32112  1  0  0  0  0\n 33 34  2  0  0  0  0\n 33113  1  0  0  0  0\n 34 35  1  0  0  0  0\n 34114  1  0  0  0  0\n 35115  1  0  0  0  0\n 36 37  1  0  0  0  0\n 36116  1  0  0  0  0\n 37 38  2  0  0  0  0\n 37 39  1  0  0  0  0\n 39 43  1  0  0  0  0\n 39 40  1  0  0  0  0\n 39117  1  6  0  0  0\n 40 41  1  0  0  0  0\n 40 42  1  0  0  0  0\n 40118  1  0  0  0  0\n 41119  1  0  0  0  0\n 41120  1  0  0  0  0\n 41121  1  0  0  0  0\n 42122  1  0  0  0  0\n 42123  1  0  0  0  0\n 42124  1  0  0  0  0\n 43 44  1  0  0  0  0\n 43 45  1  0  0  0  0\n 44125  1  0  0  0  0\n 44126  1  0  0  0  0\n 44127  1  0  0  0  0\n 45 46  2  0  0  0  0\n 45 47  1  0  0  0  0\n 47 48  1  0  0  0  0\n 47 52  1  0  0  0  0\n 47128  1  1  0  0  0\n 48 49  1  0  0  0  0\n 48 50  1  0  0  0  0\n 48129  1  1  0  0  0\n 49130  1  0  0  0  0\n 49131  1  0  0  0  0\n 49132  1  0  0  0  0\n 50 51  1  0  0  0  0\n 50133  1  0  0  0  0\n 50134  1  0  0  0  0\n 51135  1  0  0  0  0\n 51136  1  0  0  0  0\n 51137  1  0  0  0  0\n 52 53  1  0  0  0  0\n 53 54  2  0  0  0  0\n 53 55  1  0  0  0  0\n 55 56  2  0  0  0  0\n 55 59  1  0  0  0  0\n 56 57  1  0  0  0  0\n 56 58  1  0  0  0  0\n 57138  1  0  0  0  0\n 57139  1  0  0  0  0\n 57140  1  0  0  0  0\n 58141  1  0  0  0  0\n 58142  1  0  0  0  0\n 58143  1  0  0  0  0\n 59 60  1  0  0  0  0\n 59 61  1  0  0  0  0\n 60144  1  0  0  0  0\n 60145  1  0  0  0  0\n 60146  1  0  0  0  0\n 61 62  2  0  0  0  0\n 61 63  1  0  0  0  0\n 63 68  1  0  0  0  0\n 63 64  1  0  0  0  0\n 63147  1  6  0  0  0\n 64 65  1  0  0  0  0\n 64148  1  0  0  0  0\n 64149  1  0  0  0  0\n 65 66  1  0  0  0  0\n 65 67  1  0  0  0  0\n 65150  1  0  0  0  0\n 66151  1  0  0  0  0\n 66152  1  0  0  0  0\n 66153  1  0  0  0  0\n 67154  1  0  0  0  0\n 67155  1  0  0  0  0\n 67156  1  0  0  0  0\n 68 69  1  0  0  0  0\n 68157  1  0  0  0  0\n 69 70  2  0  0  0  0\n 69 71  1  0  0  0  0\n 71 75  1  0  0  0  0\n 71 72  1  0  0  0  0\n 71158  1  6  0  0  0\n 72 73  1  0  0  0  0\n 72 74  1  0  0  0  0\n 72159  1  0  0  0  0\n 73160  1  0  0  0  0\n 73161  1  0  0  0  0\n 73162  1  0  0  0  0\n 74163  1  0  0  0  0\n 74164  1  0  0  0  0\n 74165  1  0  0  0  0\n 75 76  1  0  0  0  0\n 75 77  1  0  0  0  0\n 76166  1  0  0  0  0\n 76167  1  0  0  0  0\n 76168  1  0  0  0  0\n 77 78  2  0  0  0  0\nM  END\n>  <Energy>\n1549.86\n\n>  <RMSD>\n0.873662\n\n$$$$`
// var testSDF2 = testSDF.replace(/\n/g, "\\n");
//gameInstance.SendMessage("sdfReader", "ParseSDF", testSDF2)

//Colours according to this: https://colorbrewer2.org/?type=diverging&scheme=PRGn&n=5
// var colours = ['#7b3294','#008837','#c2a5cf','#f7f7f7','#a6dba0']; 
var colours = ['#000000','#E69F00','#56B4E9','#009E73','#F0E442', '#0072B2', '#D55E00','#CC79A7'];
// var colours = ['#762a83','#9970ab','#c2a5cf','#e7d4e8','#f7f7f7', '#d9f0d3', '#a6dba0','#5aae61','#1b7837','#9970ab','#762a83'];

//Array of the all offered projections and their labels
var projections = ['Fingerprints_tsne_', 'Daylight_tsne_', 'Molecular_Descriptors_tsne_', 'Embeddings_tsne_'];
var projectionNames = ['Fingerprints', 'Daylight', 'Molecular Descriptors', 'Embeddings'];
var encodings = ['Divergence_Pearson_Correlation', 'Divergence_Kendall_Correlation', 'Molecular_weight', 'aLogP', 'cx_most_apka', 'cx_most_bpka', 'QED_weighed', 'Lipinski_RO5_violations', 'Follows_Lipinskis_RO5', 'Bioactivity_A', 'Bioactivity_B'];
var encodingNames = ['Pearson Correlation', 'Kendall Correlation', 'Molecular Weight', 'aLogP', 'Acidic Dissociation Constant', 'Basic Dissociation Constant', 'Weighed QED', 'Lipinski RO5 violations', 'Follows Lipinskis RO5', 'Serotonin 1a', 'Dopamin D2'];
var viewFunctions = ['createHexView', 'createScatterView', 'createDifferenceView'];
var funcNames = ['Hex', 'Scatter', 'Diff'];
// var encodingCategory = ['ord', 'ord', 'ord', 'ord', 'ord', 'ord', 'ord', 'cat', 'cat', 'cat', 'cat'];
var topEncodings = [1.0, 1.0, -9999.0, -9999.0, -9999.0, -9999.0, -9999.0];
var bottomEncodings = [-1.0, -1.0, 9999.0, 9999.0, 9999.0, 9999.0, 9999.0];

//Default dataset
var defaultDataset = "final/2_targets.csv";
// var defaultDataset = "final/glycoprotein.csv";

//First row
var mainHexCanvas;
var mainScatterCanvas;
var main3DCanvas;

//First row binding
var mainProjection = projections[0];
var mainHexEncoding = encodings[9];
var mainScatterEncoding = encodings[9];

//Modular canvases
var rows = 0;
var hexCanvases = [];
var scatterCanvases = [];
var differenceCanvases = [];

//Size of one hex
var hexSize = 0.07;

//array of all hexes containing any compound
var hexes = [4];
//set of IDs of selected hexes
var selectedHexes = new Set();
//set of selected compound IDs
var selectedCompounds = [];
//filtered dataset according to the selection
var selectedData;
//Unity 3D model
var gameInstance;
//String of selected SDFs from Viris service
var selectedSDFs = "You haven't selected any compounds yet you little rascall.";
//Array of arrays of selected compounds
var savedSelections = [];

//LineUp object
var lineup;
var lineupData = [];
var currentScroll;


//MAIN
//What is gonna happen when the page is loaded
window.onload = function(e) {

	//Load JavaScript and CSS files
	// loadAllDependencies();

	//Prepare the HTML layout
	prepareHTMLLayout();

	//Load the dataset to the client and wait for the promise to start building the views
	var promise = new Promise((resolve, reject) => { 
		loadData(defaultDataset, resolve, reject)
	});

	//Once the data is loaded, create init views
	promise.then(function(resolve, reject){
		startEverything();
		//Because fuck this it take infinite time to init
		if(run3D)create3Dview('right');
	})
}

function startEverything(){
	//Fuck this
	if(defaultDataset === "final/glycoprotein.csv")	{encodingNames[9] = "P-glycoprotein";}
	else {encodingNames[9] = "Serotonin 1a";}

	createHexView('mainLeft', mainProjection, mainHexEncoding)
	createScatterView('mainMiddle', mainProjection, mainScatterEncoding)
	// createDifferenceView('mainMiddle', projections[0], projections[2], encodings[0])
	createInputFormMenu('rightInputMenu');
	createLineUp('lineup', data);
	hexCanvases.forEach((canv1)=>hex_drawHexView(hexSize, canv1.div, canv1.projection, canv1.encoding));
    scatterCanvases.forEach((canv2)=>drawEnhancedScatterPlot(canv2.div, canv2.projection, canv2.encoding));
    differenceCanvases.forEach((canv3)=>drawDifferenceView(canv3.div, canv3.projection1, canv3.projection2));
}

function loadData(dataset, resolve, reject){
	// Load data
	d3.dsv(",", "./public/datasets/" + dataset, function(d, i) {
		return {
			RDKit_Canonical_Smiles:                                 d.RDKit_Canonical_Smiles,
			Molecule_ChEMBL_ID:                                     d.Molecule_ChEMBL_ID,
			Fingerprints_tsne_x:                                    +d.Fingerprints_tsne_x,
			Fingerprints_tsne_y:                                    +d.Fingerprints_tsne_y,
			Daylight_tsne_x:                                        +d.Daylight_tsne_x,
			Daylight_tsne_y:                                        +d.Daylight_tsne_y,
			Molecular_Descriptors_tsne_x:                           +d.Molecular_Descriptors_tsne_x,
			Molecular_Descriptors_tsne_y:                           +d.Molecular_Descriptors_tsne_y,
			Embeddings_tsne_x: 										+d.Embeddings_tsne_x,
			Embeddings_tsne_y: 										+d.Embeddings_tsne_y,
			Embeddings_Divergence_Pearson_Correlation: 				+d.Embeddings_Divergence_Pearson_Correlation,
			Embeddings_Divergence_Kendall_Correlation: 				+d.Embeddings_Divergence_Kendall_Correlation,
			Fingerprints_Divergence_Pearson_Correlation:            +d.Fingerprints_Divergence_Pearson_Correlation,
			Fingerprints_Divergence_Kendall_Correlation:            +d.Fingerprints_Divergence_Kendall_Correlation,
			Daylight_Divergence_Pearson_Correlation:                +d.Daylight_Divergence_Pearson_Correlation,
			Daylight_Divergence_Kendall_Correlation:                +d.Daylight_Divergence_Kendall_Correlation,
			Molecular_Descriptors_Divergence_Pearson_Correlation:   +d.Molecular_Descriptors_Divergence_Pearson_Correlation,
			Molecular_Descriptors_Divergence_Kendall_Correlation:   +d.Molecular_Descriptors_Divergence_Kendall_Correlation,
			Molecular_weight:                                       +d.Molecular_weight,
			aLogP:                                                  +d.aLogP,
			cx_most_apka:                                           +d.cx_most_apka,
			cx_most_bpka:                                           +d.cx_most_bpka,
			Lipinski_RO5_violations:                                +d.Lipinski_RO5_violations,
			Follows_Lipinskis_RO5:                                  d.Follows_Lipinskis_RO5,
			QED_weighed:                                            +d.QED_weighed,
			Bioactivity_A:                                          +d.Bioactivity_A,
			Bioactivity_B:                                          +d.Bioactivity_B,
			Index: 													+i
		};
	}).then(function(rows) {

		data=rows;
		calculateExtremes();
		return resolve();

	}).catch(function(e){
	       console.error(e);
	       return Promise.reject()
	});

}

function calculateExtremes(){
	for (var i = 2; i < 7; i++) {
		for(let comp of data){
			if(comp[encodings[i]] > topEncodings[i]) topEncodings[i] = comp[encodings[i]];
			if(comp[encodings[i]] < bottomEncodings[i]) bottomEncodings[i] = comp[encodings[i]];
		}
	}
}

function prepareHTMLLayout(){

	// <div class="row" style="display: none;" id="second_row">
 	//    <div class="block left" id='left2'></div>
 	//    <div class="block middle" id='middle2'></div>
 	//    <div class="block right" id='right2'></div>
 	//  </div>

 	var topRow = d3.select('body').append('div')//.attr("class", "container")

 	var views = topRow.append('div').attr("id", "views")//.attr('class', 'one')
 	var lineUpDiv = topRow.append('div').attr('id', 'LineUp').attr('class', 'LineUp')// two')

    var row =  views.append('div').attr("class", "row")

    row.append('div').attr("class", "block left").attr("id", "mainLeft")
    row.append('div').attr("class", "block middle").attr("id", "mainMiddle")
    // var rightTile = row.append('div').attr("class", "block")
    // rightTile.append('div').append('ul').attr('class', 'main-navigation').append('li').append('a');
    //for wide change clientWidth/3 to 6
    row.append('div').attr("class", "block right").attr("id", "right").style("height", (document.body.clientWidth/3).toString()+"px");


    //  <div class="separator">
    //   <div id="sliderdiv" style="position: absolute; left: 45%">
    //     <input id="slider" type="range" min="3" max="10" step="1" value="7"/>
    //   </div>
    // </div>
    var separator =  views.append('div').attr("class", "separator").attr("id", "separator").styles({'padding': '0px', 'margin': '0px', 'border': '0px'})
    createInputFormMenu('separator')
    // separator.append('button').text('Add new row').attr("onClick", "addNewRow(1)")
    // separator.append('input').attrs({id: 'slider', type: 'range', min: '3', max: '10', step: '1', value: '7', style: 'position: absolute; left: 45%'})

	// <div id="LineUp" class="LineUp"> </div>
}

function createHexView(div, projection, encoding){
	if(d3.select("#" + div))d3.select("#" + div).selectAll("*").remove();
	//update first row and default projections and encodings
	if(div === 'mainLeft' && (mainProjection !== projection || mainHexEncoding !== encoding)) {
		mainProjection = projection;
		mainHexEncoding = encoding;
		createScatterView('mainMiddle', projection, mainScatterEncoding);
	}

	createMenu(div, projection, encoding, "createHexView");
	hex_drawHexView(hexSize, div, projection, encoding);
}

function createScatterView(div, projection, encoding){
	if(d3.select("#" + div))d3.select("#" + div).selectAll("*").remove();
	//basically if something changes, change the main hex view as well
	if(div === 'mainMiddle' && (mainProjection !== projection || mainScatterEncoding !== encoding)) {
		mainProjection = projection;
		mainScatterEncoding = encoding;
		createHexView('mainLeft', projection, mainHexEncoding);
	}

	createMenu(div, projection, encoding, "createScatterView");
	drawEnhancedScatterPlot(div, projection, encoding)
}


function createDifferenceView(div, proj1, proj2){
	if(d3.select("#" + div))d3.select("#" + div).selectAll("*").remove();
	createDiffMenu(div, proj1, proj2)
	drawDifferenceView(div, proj1, proj2);
}

function create3Dview(div){
	gameInstance = UnityLoader.instantiate(div, "./public/3D/April21/Build/April21.json", {onProgress: UnityProgress});
}

function createLineUp(div, thisData){
	if(div=='mainLeft') currentScroll = document.documentElement.scrollTop;
	console.log(currentScroll)
	if(lineup) lineup.destroy();
	prepareLineUp(thisData);
	if(selectedCompounds.length != 0) lineup.setSelection(selectedCompounds);
	if (document.documentElement.scrollTop != currentScroll) {
		window.scrollTo(0, currentScroll)
	}
}

function createInputFormMenu(div){
	// <div class="open-btn">
 //      <button class="open-button" onclick="openForm()">
 //      <strong>Open Form</strong>
 //      </button>
 //    </div>
 		d3.select('#' + div + ' ul').remove();
 		var thisDiv = d3.select('#' + div).append('ul').attr('class', 'main-navigation').attr('z-index', 999).style("position", "relative");
 		var projectionMenu = thisDiv.append('li');
 		projectionMenu.append('a').text('ChemVA').attr("onclick", "javascript:location.href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'").style("color", colours[2])		
 		var projectionMenu = thisDiv.append('li');
 		projectionMenu.append('a').text('Add New Row').attr("onclick", "addNewRow()");	
 		var projectionMenu = thisDiv.append('li');
 		//Add possibility to select the projection
 		projectionMenu.append('a').text('Insert New Compound').attr("onclick", "openForm()");
 		projectionMenu = thisDiv.append('li');
 		projectionMenu.append('a').text('Download Selected SDFs')
 								  .attr("onclick", "downloadSDFfiles()");
 		projectionMenu = thisDiv.append('li');
 		projectionMenu.append('a').text('Save Selection')
 								  .attr("onclick", "saveSelection()");
 		projectionMenu = thisDiv.append('li').attr('z-index', 999).style("position", "relative");
 		projectionMenu.append('a').text('Load Selection').attr('z-index', 999).style("position", "relative")
 		var loadSelUl = projectionMenu.append('ul').attr('z-index', 999).style("position", "relative");
 		for (var i = savedSelections.length - 1; i >= 0; i--) {
 			loadSelUl.append('li').attr('z-index', 999).style("position", "relative").append('a')
 				.text('Selection ' + i)
 				.attr("onclick", "loadSelection(\'" + i + "\')")
 				.attr('z-index', 999).style("position", "relative")
 				
 		}

 		thisDiv.append('input').attrs({id: 'slider', type: 'range', min: '3', max: '10', step: '1', value: '7', style: 'vertical-align: middle'})

 		projectionMenu = thisDiv.append('li');
 		projectionMenu.append('a').text('Change Dataset')
 								  .attr("onclick", "changeDataset()");

 		d3.select("#slider").on("input", function() {
			hexSize = parseInt(this.value)/100;
			startEverything();
			// scattercanvas.remove();
			// hex_drawScatterPlot("fucker");
		})
}

function addNewRow(){
	num = ++rows;
	console.log("Adding row num: " + num)
	let row =  d3.select('#views').append('div')
    	.attr("class", "row")
    let leftBlock = row.append('div').attr("class", "block left").attr("id", "left" + num)
    createScatterView(leftBlock.node().id, mainProjection, mainScatterEncoding);
    let middleBlock = row.append('div').attr("class", "block middle").attr("id", "middle" + num)
    createDifferenceView(middleBlock.node().id, mainProjection, projections[1]);
    var rightTile = row.append('div').attr("class", "block")
    let rightBlock = rightTile.append('div').attr("class", "middle").attr("id", "right" + num)
    createScatterView(rightBlock.node().id, projections[1], mainScatterEncoding);

//     createScatterView(block.node().id, mainProjection, mainScatterEncoding);
// 	createDifferenceView(newTiles[1].node().id, mainProjection, projections[1]);
//     createScatterView(newTiles[2].node().id, projections[1], mainScatterEncoding);
}

// function createNewTileSelector(div){
// 	// console.log(thisTile)
// 	thisDiv = d3.select('#'+div);
// 	thisDiv.append('button').attr("class", div+'btn').text('Add new HexView').attr("onClick", "createHexView(\'" + div + "\', mainProjection, mainScatterEncoding); d3.selectAll(\'."+ div + "btn\').remove()")
// 	// thisDiv.append('<br>')
// 	thisDiv.append('button').attr("class", div+'btn').text('Add new ScatterView').attr("onClick", "createScatterView(\'" + div + "\', mainProjection, mainHexEncoding); d3.selectAll(\'."+ div + "btn\').remove()")
// 	// thisDiv.append('<br>')
// 	thisDiv.append('button').attr("class", div+'btn').text('Add new DifferenceView').attr("onClick", "createDifferenceView(\'" + div + "\', mainProjection, projections[1]); d3.selectAll(\'."+ div + "btn\').remove()")
// }


function createMenu(div, projection, encoding, func){

	//This is what it should look like
	// <ul class="main-navigation">
 //          <li><a>Projection</a>
 //            <ul>
 //              <li><a onclick="loadDataAndMakeShitHappen('glycoprotein/tsne_daylight_glycoprotein.csv')">Daylight</a></li>
 //              <li><a onclick="loadDataAndMakeShitHappen('glycoprotein/tsne_descriptors_glycoprotein.csv')">Descriptors</a></li>
 //              <li><a onclick="loadDataAndMakeShitHappen('glycoprotein/tsne_fingerprints_glycoprotein.csv')">Fingerprints</a></li>
 //              <li><a onclick="loadDataAndMakeShitHappen('glycoprotein/tsne_fingerprints_glycoprotein.csv')">Embeddings</a></li>
 //            </ul>
 //          </li>
 //          <li><a>Endocing</a>
 //            <ul>
 //              <li><a onclick="loadDataAndMakeShitHappen('2_targets/tsne_daylight_merge_2_targets.csv')">Pearson Correlation</a></li>
 //              <li><a onclick="loadDataAndMakeShitHappen('2_targets/tsne_descriptors_merge_2_targets.csv')">Kendall Correlation</a></li>
 //              <li><a onclick="loadDataAndMakeShitHappen('2_targets/tsne_fingerprints_merge_2_targets.csv')">Bioactivity</a></li>
 //            </ul>
 //          </li>
 //    </ul>

 		d3.select('#' + div + ' ul').remove();
 		//Create main navigation
 		var thisDiv = d3.select('#' + div).append('ul').attr('class', 'main-navigation');		
 		var projectionMenu = thisDiv.append('li');
 		//Add possibility to select the projection
 		projectionMenu.append('a').text('Projection:');
 		var projectionMenuUl = projectionMenu.append('ul');
 		for (var i = projections.length - 1; i >= 0; i--) {
 			projectionMenuUl.append('li').append('a')
 				.text(projectionNames[i])
 				.attr("onclick", func + "(\'" + div + "\', \'" + projections[i] + "\', \'" + encoding + "\')")
 				// .attr("onclick", "console.log(\'"+ projections[i].toString() + "\')")
 		}
 		//Print out the selected projection
 		thisDiv.append('li').append('a').text(projectionNames[projections.indexOf(projection)]);

		//Add possibility to select the encoding
		var encodingMenu = thisDiv.append('li');
 		encodingMenu.append('a').text('Color Encoding:');
 		var encodingMenuUl = encodingMenu.append('ul');
 		for (var i = encodings.length - 1; i >= 0; i--) {
 			encodingMenuUl.append('li').append('a')
 				.text(encodingNames[i])
 				.attr("onclick", func + "(\'" + div + "\', \'" + projection + "\', \'" + encodings[i] + "\')")
 				// .attr("onclick", "console.log(\'"+ projections[i].toString() + "\')")
 		}
 		//Print out the selected projection
 		thisDiv.append('li').append('a').text(encodingNames[encodings.indexOf(encoding)]); 		

 		var viewMenu = thisDiv.append('li').attr("position", "absolute").attr("right", "100px");
 		viewMenu.append('a').text(funcNames[viewFunctions.indexOf(func)]);
 		var viewMenuUl = viewMenu.append('ul');
 		for (var i = 0; i < viewFunctions.length; i++) {
 			viewMenuUl.append('li').append('a')
 				.text(funcNames[i])
 				.attr("onclick", viewFunctions[i] + "(\'" + div + "\', \'" + projection + "\', \'" + encoding + "\')")
 				// .attr("onclick", "console.log(\'"+ projections[i].toString() + "\')")
 		}
 		
}

function createDiffMenu(div, proj1, proj2){
		d3.select('#' + div + ' ul').remove();
 		//Create main navigation
 		var thisDiv = d3.select('#' + div).append('ul').attr('class', 'main-navigation');		
 		var projectionMenu = thisDiv.append('li');
 		//Add possibility to select the projection
 		projectionMenu.append('a').text('Projected Projection:');
 		var projectionMenuUl = projectionMenu.append('ul');
 		for (var i = projections.length - 1; i >= 0; i--) {
 			projectionMenuUl.append('li').append('a')
 				.text(projectionNames[i])
 				.attr("onclick", "createDifferenceView(\'" + div + "\', \'" + projections[i] + "\', \'" + proj2 + "\')")
 				// .attr("onclick", "console.log(\'"+ projections[i].toString() + "\')")
 		}
 		//Print out the selected projection
 		thisDiv.append('li').append('a').text(projectionNames[projections.indexOf(proj1)]);

 		projectionMenu = thisDiv.append('li');
 		projectionMenu.append('a').text('->').attr("onclick", "createDifferenceView(\'" + div + "\', \'" + proj2 + "\', \'" + proj1 + "\')");
 		//Add possibility to select the projection
 		projectionMenu = thisDiv.append('li');
 		projectionMenu.append('a').text('After Selection:');
 		var projectionMenuUl = projectionMenu.append('ul');
 		for (var i = projections.length - 1; i >= 0; i--) {
 			projectionMenuUl.append('li').append('a')
 				.text(projectionNames[i])
 				.attr("onclick", "createDifferenceView(\'" + div + "\', \'" + proj1 + "\', \'" + projections[i] + "\')")
 				// .attr("onclick", "console.log(\'"+ projections[i].toString() + "\')")
 		}
 		//Print out the selected projection
 		thisDiv.append('li').append('a').text(projectionNames[projections.indexOf(proj2)]);

 		var viewMenu = thisDiv.append('li').attr("position", "absolute").attr("right", "100px");
 		viewMenu.append('a').text(funcNames[viewFunctions.indexOf('createDifferenceView')]);
 		var viewMenuUl = viewMenu.append('ul');
 		for (var i = 0; i < viewFunctions.length; i++) {
 			viewMenuUl.append('li').append('a')
 				.text(funcNames[i])
 				.attr("onclick", viewFunctions[i] + "(\'" + div + "\', \'" + proj1 + "\', \'" + mainHexEncoding + "\')")
 				// .attr("onclick", "console.log(\'"+ projections[i].toString() + "\')")
 		}
}

function highlightHexesContainingSelectedCompounds(){
	//paint hexes, that contain selected compounds in black
	for (let selComp of selectedCompounds){
          for(let proj of projections){
            d3.selectAll("#hex-" + data[selComp][proj]).each( function(d){
              if(d3.select(this).attr("projection") === proj){
                d3.select(this).attrs({
                  "stroke": "black",
                  "stroke-width": 5
                });
              }
            })
          }
     }
}

function openForm() {
        document.getElementById("loginPopup").style.display="block";
      }
      
function closeForm() {
	document.getElementById("loginPopup").style.display= "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	var modal = document.getElementById('loginPopup');
	if (event.target == modal) {
	  closeForm();
	}
}

function changeDataset(){
	if(defaultDataset === 'final/2_targets.csv') {defaultDataset = "final/glycoprotein.csv"}
	else {defaultDataset = "final/2_targets.csv"}
	var promise = new Promise((resolve, reject) => { 
		loadData(defaultDataset, resolve, reject)
	});

	//Once the data is loaded, create init views
	promise.then(function(resolve, reject){
		startEverything();
	})
}

// Functions for automatic loading of js and css files, unfortunatelly work only half of time and I don't know why

//Function for appending one script into the document
// function loadScript(path){
// 	var script = document.createElement("script");
// 	script.src = path;
// 	document.body.appendChild(script);
// }

// function loadStyle(path){
// 	var css = document.createElement("link");
// 	css.href = path;
// 	css.rel = 'stylesheet';
// 	document.body.appendChild(css);
// }

//Function for loading scripts, so we don't need to have them in the HTML file
// function loadAllDependencies(){

// 	//Load CSS Styles
// 	loadStyle("./public/styles/styles.css");
// 	loadStyle("./public/styles/lasso-style.css");

// 	var directory = './public/';
// 	var extension = '.js';
// 	var files = ['lasso-min', 'myhexlib', 'lineup', 'scatter'];  
// 	for (var file of files){ 
// 	   var path = directory + file + extension; 
// 	   loadScript(path);
// 	} 
// }



