import os
os.environ['TF_CPP_MIN_LOG_LEVEL']='3'
import sys
import json

from rdkit import Chem
from rdkit.Chem import AllChem, Descriptors
from resources.mol2vec.features import featurize

import pandas as pd
import numpy as np
import pickle as pkl

import h5py
stderr = sys.stderr
sys.stderr = open(os.devnull, 'w')
from keras.models import model_from_json
sys.stderr = stderr

#-----------------------------------------------------------------------
#              PYTHON  FUNCTIONS - COMPUTE SOURCE DATA
#-----------------------------------------------------------------------

# Step 0 - compute RDKit canonical SMILES
# if this step fails no further calculation can be done!
def get_canonical_smiles(smiles):
    m = Chem.MolFromSmiles(smiles)
    to_return = None
    if m is not None:
        s = Chem.MolToSmiles(m)
        to_return = s
    return to_return

# Step 1 - compute fingerprint and daylight fp
# returns a tuple containing two numpy arrays of bits,
# -----> the first array corresponds to the Morgan fingerprint
# -----> the second array corresponds to the daylight fingerprint
def generate_fingerprints(smiles):
    # first compute mol from smiles
    m = Chem.MolFromSmiles(smiles)
    to_return = (None, None)
    if m is not None:
        # first generate the fingerprints, which are returned as a string of bits
        fp = AllChem.GetMorganFingerprintAsBitVect(m,radius=2,nBits=1024).ToBitString()
        dy = Chem.RDKFingerprint(m,fpSize=1024).ToBitString()
        # then, transform those strings of bits to numpy arrays of bits
        fpa = np.asarray([np.int(e) for e in list(fp)])
        dya = np.asarray([np.int(e) for e in list(dy)])
        to_return = (fpa, dya)
        #to_return = (1,2)
    return to_return

# Step 1 - compute embedding
# returns a numpy array containing the 300-dim molecular embedding of the compound
def generate_embedding(smiles):
    # first canonicalize smiles
    m = Chem.MolFromSmiles(smiles)
    to_return = None
    # set paths to featurization
    path_to_input = os.getcwd()+'/public/resources/temp/smiles_to_embed.smi'
    path_to_output = os.getcwd()+'/public/resources/temp/embedding_new_compound.csv'
    path_to_model = os.getcwd()+'/public/resources/mol2vec/model_300dim.pkl'
    # if molecule could be computed
    if m is not None:
        # write canonical smiles to temporary file
        s = Chem.MolToSmiles(m)
        fd = open(path_to_input, 'w')
        fd.write(s)
        fd.close()
        # call featurization function (from mol2vec.features import featurize)
        output = featurize(path_to_input, path_to_output, path_to_model, r=1, uncommon = 'UNK')
        df = pd.read_csv(path_to_output)
        to_return = df.iloc[0,2:].values
        #to_return = 99
    return to_return

# Step 1 - compute molecular descriptors using Mordred
# returns a numpy array containing the n-dim vector of md's of the new compounds
def generate_descriptors(smiles):
    # first canonicalize smiles
    m = Chem.MolFromSmiles(smiles)
    to_return = None
    if m is not None:
        s = Chem.MolToSmiles(m)
        # TODO
        to_return = np.array()
    return to_return

# Step 1 - compute aLogP and MolWeight for compound
# returns a tuple with both computed values: (aLogP, MolWt)
def generate_LogP_MolWt(smiles):
    # first get mol from smiles
    m = Chem.MolFromSmiles(smiles)
    to_return = (None,None)
    if m is not None:
        MW = Descriptors.MolWt(m)
        LP = Descriptors.MolLogP(m)
        to_return = (LP, MW)
    return to_return

#-----------------------------------------------------------------------
#            PYTHON  FUNCTIONS - LOAD MODELS & GET PROJECTIONS
#-----------------------------------------------------------------------

# Step 2 - load fp model and get projection
def get_fp_projection(fingerprint, dataset):
    model_path = os.getcwd()+'/public/resources/parametric_models/model_fingerprints_' + dataset + '.json'
    weight_path = os.getcwd()+'/public/resources/parametric_models/model_fingerprints_' + dataset +'.h5'

    # load json and create model
    json_file = open(model_path)
    loaded_model_json = json_file.read()
    json_file.close()
    loaded_model = model_from_json(loaded_model_json)

    # load weights into new model
    loaded_model.load_weights(weight_path)

    # reshape input data
    fp = fingerprint.reshape(1,len(fingerprint))
    pred = loaded_model.predict(fp)
    pred = np.clip(pred,0,1)
    x = pred[0,0]
    y = pred[0,1]
    return (x,y)


# Step 2 - load dy model and get projection
def get_dy_projection(daylight, dataset):
    model_path = os.getcwd()+'/public/resources/parametric_models/model_daylight_' + dataset + '.json'
    weight_path = os.getcwd()+'/public/resources/parametric_models/model_daylight_' + dataset +'.h5'

    # load json and create model
    json_file = open(model_path)
    loaded_model_json = json_file.read()
    json_file.close()
    loaded_model = model_from_json(loaded_model_json)

    # load weights into new model
    loaded_model.load_weights(weight_path)

    # reshape input data
    dy = daylight.reshape(1,len(daylight))
    pred = loaded_model.predict(dy)
    pred = np.clip(pred,0,1)
    x = pred[0,0]
    y = pred[0,1]
    return (x,y)


# Step 2 - load emb model and get projection
def get_emb_projection(embedding, dataset):
    model_path = os.getcwd()+'/public/resources/parametric_models/model_embeddings_' + dataset + '.json'
    weight_path = os.getcwd()+'/public/resources/parametric_models/model_embeddings_' + dataset +'.h5'

    # load json and create model
    json_file = open(model_path)
    loaded_model_json = json_file.read()
    json_file.close()
    loaded_model = model_from_json(loaded_model_json)

    # load weights into new model
    loaded_model.load_weights(weight_path)

    # reshape input data
    emb = embedding.reshape(1,len(embedding))
    pred = loaded_model.predict(emb)
    pred = np.clip(pred,0,1)
    x = pred[0,0]
    y = pred[0,1]
    return (x,y)


# Step 2 - load desc model and get projection
def get_desc_projection(descriptors, dataset):
    model_path = os.getcwd()+'/public/resources/parametric_models/model_descriptors_' + dataset + '.json'
    weight_path = os.getcwd()+'/public/resources/parametric_models/model_descriptors_' + dataset +'.h5'

    # load json and create model
    json_file = open(model_path)
    loaded_model_json = json_file.read()
    json_file.close()
    loaded_model = model_from_json(loaded_model_json)

    # load weights into new model
    loaded_model.load_weights(weight_path)

    # reshape input data
    desc = descriptors.reshape(1,len(descriptors))
    pred = loaded_model.predict(desc)
    pred = np.clip(pred,0,1)
    x = pred[0,0]
    y = pred[0,1]
    return (x,y)

# For debugging purposes only
def hola(smiles):
    return smiles+'hola!'

#----------------------------------------------------------------------------
#                 COMMUNICATION WITH THE WEB SERVICE VIA JSON
#----------------------------------------------------------------------------

json_data = ' '.join(sys.argv[1:])

# Load ds input as JSON
my_data = json.loads(json_data)

received_smiles = ''
received_dataset = ''

# hardcoded - these are 2 SMILES formulas that are present in the P-glycoprotein dataset, which do not have 3D structures (complex structures)
# whenever one of these two SMILES formulas is selected in the client, it is just simply ignored
forbidden_smiles = ['CC[C@H](C)[C@@H]1NC(=O)[C@@H]2CCCN2C(=O)[C@H](Cc2ccccc2)N(C)C(=O)[C@H](Cc2ccccc2)NC(=O)[C@H](C(C)C)N(C)C(=O)[C@@H]([C@@H](C)CC)OC(=O)CN(C)C(=O)[C@H](CC(C)C)NC(=O)[C@H](C(C)C)N(C)C1=O','CC[C@H](C)[C@H]1O[C@]2(CC[C@@H]1C)C[C@@H]1C[C@@H](C/C=C(\C)[C@@H](O[C@H]3C[C@H](OC)[C@@H](O[C@H]4C[C@H](OC)[C@@H](O)[C@H](C)O4)[C@H](C)O3)[C@@H](C)/C=C/C=C3\CO[C@@H]4[C@H](O)C(C)=C[C@@H](C(=O)O1)[C@]34O)O2.CO[C@H]1C[C@H](O[C@H]2[C@H](C)O[C@@H](O[C@@H]3/C(C)=C/C[C@@H]4C[C@@H](C[C@]5(CC[C@H](C)[C@@H](C(C)C)O5)O4)OC(=O)[C@@H]4C=C(C)[C@@H](O)[C@H]5OC/C(=C\C=C\[C@@H]3C)[C@@]45O)C[C@@H]2OC)O[C@@H](C)[C@@H]1O']

base_datasets = ['P-glycoprotein','serotonin-dopamine']

xfp = yfp = None
xdy = ydy = None
xem = yem = None
xd = yd = None
cs = None
LP = None
MW = None
hello = None

compound = my_data["compound"]

if not compound["smiles"] in forbidden_smiles:
    received_smiles = compound["smiles"]
    # empezamos a calcular y recuperar los datos necesarios
    fp, dy = generate_fingerprints(received_smiles)
    em = generate_embedding(received_smiles)
    cs = get_canonical_smiles(received_smiles)
    LP, MW = generate_LogP_MolWt(received_smiles)
    hello = hola(received_smiles)
#
    if compound["dataset"] in base_datasets and fp is not None:
        received_dataset = 'g' if compound["dataset"]==base_datasets[0] else '2t'

        # empezamos a computar las proyecciones
        xfp, yfp = get_fp_projection(fp, received_dataset)
        xdy, ydy = get_dy_projection(dy, received_dataset)
        xem, yem = get_emb_projection(em, received_dataset)
          

data = {'canonical_smiles':cs,
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
        'MolWt': str(MW),
        'greetings': hello        
        }
# Print the output to stdout to return it back to Node.js
print(json.dumps(data))
sys.stdout.flush()
