from rdkit import Chem
from rdkit.Chem import AllChem, Descriptors
from public.resources.mol2vec.features import featurize

import pandas as pd
import numpy as np
import pickle as pkl
import os

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
        # TODO - ChemVA does not currently support online computation of molecular descriptors for new compounds.
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
