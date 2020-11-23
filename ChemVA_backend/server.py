# USAGE
# Start the server:
# 	python run_keras_server.py
# Submit a request via cURL:
# 	curl -X POST -F image=@dog.jpg 'http://localhost:5000/predict'
# Submita a request via Python:
#	python simple_request.py

# import the necessary packages
import numpy as np
import flask
import io
import json
import sys

# import auxiliary functions
import source_data
import molecular_alignment

# import keras and get rid of info log level
import os
os.environ['TF_CPP_MIN_LOG_LEVEL']='3'
import h5py
from keras.models import model_from_json

# CORS
from flask_cors import CORS, cross_origin

# initialize our Flask application and the Keras model
app = flask.Flask(__name__)
model = None

# Necessary to enable CORS
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r"/new_compound": {"origins": "*"}})
cors = CORS(app, resources={r"/smiles_to_sdf": {"origins": "*"}})

# ---------------------------------
# CONSTANTS
# ---------------------------------
 
# hardcoded - these are 2 SMILES formulas that are present in the P-glycoprotein dataset, which do not have 3D structures (complex structures)
# whenever one of these two SMILES formulas is selected in the client, it is just simply ignored
forbidden_smiles = ['CC[C@H](C)[C@@H]1NC(=O)[C@@H]2CCCN2C(=O)[C@H](Cc2ccccc2)N(C)C(=O)[C@H](Cc2ccccc2)NC(=O)[C@H](C(C)C)N(C)C(=O)[C@@H]([C@@H](C)CC)OC(=O)CN(C)C(=O)[C@H](CC(C)C)NC(=O)[C@H](C(C)C)N(C)C1=O','CC[C@H](C)[C@H]1O[C@]2(CC[C@@H]1C)C[C@@H]1C[C@@H](C/C=C(\C)[C@@H](O[C@H]3C[C@H](OC)[C@@H](O[C@H]4C[C@H](OC)[C@@H](O)[C@H](C)O4)[C@H](C)O3)[C@@H](C)/C=C/C=C3\CO[C@@H]4[C@H](O)C(C)=C[C@@H](C(=O)O1)[C@]34O)O2.CO[C@H]1C[C@H](O[C@H]2[C@H](C)O[C@@H](O[C@@H]3/C(C)=C/C[C@@H]4C[C@@H](C[C@]5(CC[C@H](C)[C@@H](C(C)C)O5)O4)OC(=O)[C@@H]4C=C(C)[C@@H](O)[C@H]5OC/C(=C\C=C\[C@@H]3C)[C@@]45O)C[C@@H]2OC)O[C@@H](C)[C@@H]1O']

base_datasets = ['P-glycoprotein','serotonin-dopamine']

# ------------------------------------------------------------------------
#               PYTHON FUNCTIONS - LOAD MODELS AND WEIGHTS
# ------------------------------------------------------------------------

# P-glycoprotein
def load_models_g():
    # load the pre-trained Keras models
    global model_fp_g, model_dy_g, model_emb_g
    model_path = os.getcwd()+'/public/resources/parametric_models/model_'
    weight_path = os.getcwd()+'/public/resources/parametric_models/model_'

    # load json and create model - fingerprints
    json_file = open(model_path+'fingerprints_g.json')
    loaded_model_json = json_file.read()
    json_file.close()
    model_fp_g = model_from_json(loaded_model_json)
    # load weights into new model
    model_fp_g.load_weights(weight_path + 'fingerprints_g.h5')

    # load json and create model - daylight
    json_file = open(model_path+'daylight_g.json')
    loaded_model_json = json_file.read()
    json_file.close()
    model_dy_g = model_from_json(loaded_model_json)
    # load weights into new model
    model_dy_g.load_weights(weight_path + 'daylight_g.h5')

    # load json and create model - embeddings
    json_file = open(model_path+'embeddings_g.json')
    loaded_model_json = json_file.read()
    json_file.close()
    model_emb_g = model_from_json(loaded_model_json)
    # load weights into new model
    model_emb_g.load_weights(weight_path + 'embeddings_g.h5')

# Serotonin-dopamine (2 targets - 2t)
def load_models_2t():
    # load the pre-trained Keras models
    global model_fp_2t, model_dy_2t, model_emb_2t
    model_path = os.getcwd()+'/public/resources/parametric_models/model_'
    weight_path = os.getcwd()+'/public/resources/parametric_models/model_'

    # load json and create model - fingerprints
    json_file = open(model_path+'fingerprints_2t.json')
    loaded_model_json = json_file.read()
    json_file.close()
    model_fp_2t = model_from_json(loaded_model_json)
    # load weights into new model
    model_fp_2t.load_weights(weight_path + 'fingerprints_2t.h5')

    # load json and create model - daylight
    json_file = open(model_path+'daylight_2t.json')
    loaded_model_json = json_file.read()
    json_file.close()
    model_dy_2t = model_from_json(loaded_model_json)
    # load weights into new model
    model_dy_2t.load_weights(weight_path + 'daylight_2t.h5')

    # load json and create model - embeddings
    json_file = open(model_path+'embeddings_2t.json')
    loaded_model_json = json_file.read()
    json_file.close()
    model_emb_2t = model_from_json(loaded_model_json)
    # load weights into new model
    model_emb_2t.load_weights(weight_path + 'embeddings_2t.h5')

# ------------------------------------------------------------------------
#             PYTHON FUNCTIONS - COMPUTE DATA FOR NEW COMPOUND
# ------------------------------------------------------------------------

def get_em_projection(embedding, dataset):
    if (dataset == 'g'):
        model = model_emb_g
    else:
        model = model_emb_2t
    
    # reshape input data
    emb = embedding.reshape(1,len(embedding))
    pred = model.predict(emb)
    pred = np.clip(pred,0,1)
    x = pred[0,0]
    y = pred[0,1]
    return (x,y)

def get_dy_projection(daylight, dataset):
    if (dataset == 'g'):
        model = model_dy_g
    else:
        model = model_dy_2t
    
    # reshape input data
    dy = daylight.reshape(1,len(daylight))
    pred = model.predict(dy)
    pred = np.clip(pred,0,1)
    x = pred[0,0]
    y = pred[0,1]
    return (x,y)

def get_fp_projection(fingerprint, dataset):
    if (dataset == 'g'):
        model = model_fp_g
    else:
        model = model_fp_2t
    
    # reshape input data
    fp = fingerprint.reshape(1,len(fingerprint))
    pred = model.predict(fp)
    pred = np.clip(pred,0,1)
    x = pred[0,0]
    y = pred[0,1]
    return (x,y)

def compute_new_compound(compound):
    received_smiles = ''
    received_dataset = ''
    
    cs = None
    LP = None
    MW = None

    received_smiles = compound["smiles"]
    received_dataset = 'g' if compound["dataset"]==base_datasets[0] else '2t'

    fp, dy = source_data.generate_fingerprints(received_smiles)
    em = source_data.generate_embedding(received_smiles)
    cs = source_data.get_canonical_smiles(received_smiles)
    LP, MW = source_data.generate_LogP_MolWt(received_smiles)

    if fp is not None:
        fp_coords = get_fp_projection(fp, received_dataset)
    if dy is not None:
        dy_coords = get_dy_projection(dy, received_dataset)
    if em is not None:
        em_coords = get_em_projection(em, received_dataset)

    tuple_to_return = (fp_coords,dy_coords,em_coords,cs,LP,MW)
    return tuple_to_return

# ------------------------------------------------------------------------
#                    PYTHON FUNCTIONS - ON POST ACTIONS
# ------------------------------------------------------------------------

@app.route("/new_compound", methods=["POST"])
def new_compound():

    xfp = yfp = None
    xdy = ydy = None
    xem = yem = None
    cs = None
    LP = None
    MW = None

    if flask.request.method == "POST":
        data = flask.request.get_json()
        compound = data["compound"]
        if not compound["smiles"] in forbidden_smiles and compound["dataset"] in base_datasets:
            fp_coords, dy_coords, em_coords, cs, LP, MW = compute_new_compound(compound)
            xfp,yfp = fp_coords
            xdy,ydy= dy_coords
            xem,yem = em_coords

    toret= {'canonical_smiles':cs,
            'fingerprint':{
                'x' : str(xfp),
                'y' : str(yfp)
                },
            'daylight':{
                'x' : str(xdy),
                'y' : str(ydy)
                },
            'embedding':{
                'x' : str(xem),
                'y' : str(yem)
                },
            'aLogP':str(LP),
            'MolWt': str(MW)
            }

    # return the data dictionary as a JSON response
    return flask.jsonify(toret)


@app.route("/smiles_to_sdf", methods=["POST"])
def smiles_to_sdf():
    wsos = ''
    output = None

    if flask.request.method == "POST":
        data = flask.request.get_json()
        for formula in data["formulas"]:
            if not formula["smiles"] in forbidden_smiles:
                wsos = wsos + formula["smiles"] + ','

        wsos = wsos[:-1]
        
        if (len(wsos.split(',')) == 1):
            output = molecular_alignment.get_precomputed_3D_conformations(wsos)[0]
        else:
            output = molecular_alignment.calculate_molecular_alignment(wsos)
    
    toret = {'output':output}

    # return the data dictionary as a JSON response
    return flask.jsonify(toret)

# ------------------------------------------------------------------------
#                    PYTHON MAIN - RUN SERVICE
# ------------------------------------------------------------------------

# if this is the main thread of execution first load the model and
# then start the server
if __name__ == "__main__":
    print(("* Loading Keras model and Flask starting server..."
    "please wait until server has fully started"))
    load_models_g()
    load_models_2t()
    app.run(host="0.0.0.0", port=PORT) #Replace PORT by the port number you wish to use
