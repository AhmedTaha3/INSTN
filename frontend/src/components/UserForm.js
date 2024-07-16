import React, { useState } from 'react';
import './userform.css';
// test github
const UserForm = () => {
    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const [personalInfo, setPersonalInfo] = useState({
        name: '',
        address: '',
        phone: '',
        email: ''
    });

    const [samples, setSamples] = useState([
        {
            sampleType: '',
            samplingLocation: '',
            samplingDate: getCurrentDate(),
            sampledBy: '',
            analysisDetails: [
                {
                    analysisType: '',
                    parameter: '',
                    technique: ''
                }
            ]
        }
    ]);

    const handlePersonalInfoChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo({
            ...personalInfo,
            [name]: value
        });
    };

    const handleSamplesChange = (index, e) => {
        const { name, value } = e.target;
        const updatedSamples = [...samples];
        updatedSamples[index] = {
            ...updatedSamples[index],
            [name]: value
        };
        setSamples(updatedSamples);
    };

    const handleAnalysisDetailsChange = (sampleIndex, analysisIndex, e) => {
        const { name, value } = e.target;
        const updatedSamples = [...samples];
        const updatedAnalysisDetails = [...updatedSamples[sampleIndex].analysisDetails];
        updatedAnalysisDetails[analysisIndex] = {
            ...updatedAnalysisDetails[analysisIndex],
            [name]: value
        };
        updatedSamples[sampleIndex].analysisDetails = updatedAnalysisDetails;
        setSamples(updatedSamples);
    };

    const addAnalysis = (sampleIndex) => {
        const updatedSamples = [...samples];
        updatedSamples[sampleIndex].analysisDetails.push({
            analysisType: '',
            parameter: '',
            technique: ''
        });
        setSamples(updatedSamples);
    };

    const addSample = () => {
        setSamples([...samples, {
            sampleType: '',
            samplingLocation: '',
            samplingDate: getCurrentDate(),
            sampledBy: '',
            analysisDetails: [
                {
                    analysisType: '',
                    parameter: '',
                    technique: ''
                }
            ]
        }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const response = await fetch('http://192.168.43.184/instn/backend/index.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                personalInfo,
                samples
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Formulaire soumis avec succès!');
        } else {
            alert('Erreur lors de la soumission du formulaire.');
        }
        
        // Réinitialiser le formulaire après soumission
        setPersonalInfo({ name: '', address: '', phone: '', email: '' });
        setSamples([{
            sampleType: '',
            samplingLocation: '',
            samplingDate: getCurrentDate(),
            sampledBy: '',
            analysisDetails: [
                {
                    analysisType: '',
                    parameter: '',
                    technique: ''
                }
            ]
        }]);
    };

    const getParameterOptions = (sampleType) => {
        switch (sampleType) {
            case 'eau':
                return ['Metaux', 'Hg', 'Anion', 'Cation', 'Elements radioactif'];
            case 'sol':
            case 'minerais':
                return ['Metaux', 'Hg', 'Elements radioactif'];
            case 'denree':
                return ['Metaux', 'Metaux lourds', 'Elements nutritif', 'Elements radioactif'];
            case 'air':
                return ['PM', 'Metaux', 'Randon'];
            default:
                return [];
        }
    };

    const getTechniqueOptions = (sampleType, parameter) => {
        if (parameter === 'Metaux' && (sampleType === 'eau' || sampleType === 'denree')) {
            return ['AAS'];
        } else if (parameter === 'Hg') {
            return ['DMA'];
        } else if (parameter === 'Anion' || parameter === 'Cation') {
            return ['CI'];
        } else if (parameter === 'Elements radioactif') {
            return ['Spectrometre Gamma', 'Spectrometre alpha'];
        } else if ((parameter === 'Metaux' && (sampleType === 'sol' || sampleType === 'minerais')) ||
            parameter === 'Elements nutritif' || parameter === 'Metaux lourds') {
            return ['EDXRF'];
        } else if (parameter === 'PM') {
            return ['Drafimetrie'];
        } else if ((parameter === 'Metaux' || parameter === 'Randon') && sampleType === 'air') {
            return ['EDXRF'];
        }
        return [];
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-header">
                <h2>Informations personnelles du client</h2>
            </div>
            <div className="form-group">
                <label>Nom du client:</label>
                <input
                    type="text"
                    name="name"
                    value={personalInfo.name}
                    onChange={handlePersonalInfoChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Adresse:</label>
                <input
                    type="text"
                    name="address"
                    value={personalInfo.address}
                    onChange={handlePersonalInfoChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Téléphone:</label>
                <input
                    type="text"
                    name="phone"
                    value={personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    required
                />
            </div>
            <div className="form-header">
                <h2>Informations sur les échantillons</h2>
            </div>
            {samples.map((sample, index) => (
                <div key={index} className="sample-group">
                    <h3>Échantillon {index + 1}</h3>
                    <div className="form-group">
                        <label>Type d'échantillon:</label>
                        <select
                            name="sampleType"
                            value={sample.sampleType}
                            onChange={(e) => handleSamplesChange(index, e)}
                            required
                        >
                            <option value="">Sélectionner un type</option>
                            <option value="eau">Eau</option>
                            <option value="sol">Sol</option>
                            <option value="minerais">Minerais</option>
                            <option value="denree">Denrée alimentaire</option>
                            <option value="air">Air</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Lieu de prélèvement:</label>
                        <input
                            type="text"
                            name="samplingLocation"
                            value={sample.samplingLocation}
                            onChange={(e) => handleSamplesChange(index, e)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Date de prélèvement:</label>
                        <input
                            type="date"
                            name="samplingDate"
                            value={sample.samplingDate}
                            onChange={(e) => handleSamplesChange(index, e)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Prélevé par:</label>
                        <input
                            type="text"
                            name="sampledBy"
                            value={sample.sampledBy}
                            onChange={(e) => handleSamplesChange(index, e)}
                            required
                        />
                    </div>
                    <div className="form-header">
                        <h4>Détails des analyses</h4>
                    </div>
                    {sample.analysisDetails.map((analysis, analysisIndex) => (
                        <div key={analysisIndex} className="analysis-group">
                            <div className="form-group">
                                <label>Type d'analyse:</label>
                                <select
                                    name="analysisType"
                                    value={analysis.analysisType}
                                    onChange={(e) => handleAnalysisDetailsChange(index, analysisIndex, e)}
                                    required
                                >
                                    <option value="">Sélectionner un type</option>
                                    <option value="Qualitative">Qualitative</option>
                                    <option value="Quantitative">Quantitative</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Paramètre:</label>
                                <select
                                    name="parameter"
                                    value={analysis.parameter}
                                    onChange={(e) => handleAnalysisDetailsChange(index, analysisIndex, e)}
                                    required
                                >
                                    <option value="">Sélectionner un paramètre</option>
                                    {getParameterOptions(sample.sampleType).map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Technique:</label>
                                <select
                                    name="technique"
                                    value={analysis.technique}
                                    onChange={(e) => handleAnalysisDetailsChange(index, analysisIndex, e)}
                                    required
                                >
                                    <option value="">Sélectionner une technique</option>
                                    {getTechniqueOptions(sample.sampleType, analysis.parameter).map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={() => addAnalysis(index)}>
                        Ajouter une analyse
                    </button>
                </div>
            ))}
            <button type="button" onClick={addSample}>
                Ajouter un échantillon
            </button>
            <button type="submit">Soumettre</button>
        </form>
    );
};

export default UserForm;
