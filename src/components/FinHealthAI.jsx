import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShieldCheck, CreditCard, Activity, TrendingUp, Calculator, AlertCircle, CheckCircle, Lock, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAuth } from '../contexts/AuthContext';
import finHealthImage from '../assets/finhealth_cost_prediction.png';
import bnplImage from '../assets/finhealth_bnpl.png';
import { predictHealthcareCosts, recommendInsurance, calculateBNPL, getRiskAssessment } from '../utils/mockAI';

const FinHealthAI = () => {
  const { currentUser, userProfile } = useAuth();
  const [formData, setFormData] = useState({
    age: '',
    preExistingConditions: '',
    lifestyle: '',
    income: '',
    location: ''
  });
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedBNPLMonths, setSelectedBNPLMonths] = useState(6);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!currentUser) {
      alert('Please sign in to use FinHealth AI predictions');
      return;
    }
    
    setLoading(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const predictedCost = predictHealthcareCosts(formData);
    const insuranceRecommendations = recommendInsurance(formData, predictedCost);
    const riskAssessment = getRiskAssessment(formData, predictedCost);
    const bnplOptions = calculateBNPL(predictedCost, selectedBNPLMonths);
    
    setResults({
      predictedCost,
      insuranceRecommendations,
      riskAssessment,
      bnplOptions,
      userPlan: userProfile?.plan || 'free'
    });
    
    setLoading(false);
  };

  const renderBasicResults = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-primary" />
            <span>Basic Cost Estimate</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 mb-2">
              ${Math.floor(results.predictedCost * 0.7).toLocaleString()} - ${Math.floor(results.predictedCost * 1.3).toLocaleString()}
            </p>
            <p className="text-gray-600">Estimated annual healthcare costs</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Upgrade Prompt */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="text-center">
            <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              🔓 Unlock Detailed Predictions & Insurance Suggestions
            </h3>
            <p className="text-gray-600 mb-4">
              Get comprehensive cost breakdown, personalized insurance recommendations, and BNPL options with Premium Plan
            </p>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-2xl font-bold text-primary">$19.99</span>
              <span className="text-gray-600">/month</span>
            </div>
            <Link to="/pricing">
              <Button className="bg-primary hover:bg-primary/90">
                Upgrade Now
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDetailedResults = () => (
    <div className="space-y-6">
      {/* Detailed Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-primary" />
            <span>Detailed Cost Prediction</span>
            <Crown className="w-4 h-4 text-primary" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Annual Cost Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Routine Care</span>
                  <span className="font-medium">${Math.floor(results.predictedCost * 0.3).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Medications</span>
                  <span className="font-medium">${Math.floor(results.predictedCost * 0.25).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Specialist Visits</span>
                  <span className="font-medium">${Math.floor(results.predictedCost * 0.2).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Emergency/Urgent Care</span>
                  <span className="font-medium">${Math.floor(results.predictedCost * 0.15).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Preventive Care</span>
                  <span className="font-medium">${Math.floor(results.predictedCost * 0.1).toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total Estimated Cost</span>
                  <span className="text-primary">${results.predictedCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Risk Assessment</h4>
              <div className="space-y-3">
                <div className={`p-3 rounded-lg ${
                  results.riskAssessment.level === 'Low' ? 'bg-green-50 border border-green-200' :
                  results.riskAssessment.level === 'Medium' ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className={`w-5 h-5 ${
                      results.riskAssessment.level === 'Low' ? 'text-green-600' :
                      results.riskAssessment.level === 'Medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`} />
                    <span className="font-medium">Risk Level: {results.riskAssessment.level}</span>
                  </div>
                  <p className="text-sm text-gray-600">{results.riskAssessment.description}</p>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Recommendations:</h5>
                  <ul className="space-y-1">
                    {results.riskAssessment.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span>Personalized Insurance Recommendations</span>
            <Crown className="w-4 h-4 text-primary" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.insuranceRecommendations.map((plan, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 ${
                plan.recommended ? 'border-primary bg-primary/5' : 'border-gray-200'
              }`}>
                <div className="text-center mb-3">
                  <h4 className="font-bold text-lg">{plan.name}</h4>
                  <p className="text-2xl font-bold text-primary">${plan.monthlyPremium}</p>
                  <p className="text-sm text-gray-600">per month</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Deductible</span>
                    <span className="font-medium">${plan.deductible.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Out-of-pocket max</span>
                    <span className="font-medium">${plan.outOfPocketMax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Coverage</span>
                    <span className="font-medium">{plan.coverage}%</span>
                  </div>
                </div>
                
                {plan.recommended && (
                  <div className="bg-primary text-white text-xs px-2 py-1 rounded text-center">
                    Recommended for you
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* BNPL Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <span>Buy Now, Pay Later Options</span>
            <Crown className="w-4 h-4 text-primary" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <img 
                src={bnplImage} 
                alt="BNPL for Healthcare" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            
            <div>
              <div className="mb-4">
                <Label htmlFor="bnpl-months">Payment Plan</Label>
                <Select value={selectedBNPLMonths.toString()} onValueChange={(value) => setSelectedBNPLMonths(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 months</SelectItem>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Payment Schedule</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Amount</span>
                      <span className="font-medium">${results.predictedCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Payment</span>
                      <span className="font-medium text-primary">${results.bnplOptions.monthlyPayment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Rate</span>
                      <span className="font-medium">{results.bnplOptions.interestRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total with Interest</span>
                      <span className="font-medium">${results.bnplOptions.totalWithInterest.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">
                  Apply for BNPL Plan
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-muted to-secondary/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-primary">FinHealth</span> <span className="ai-text">AI</span> - Smart Healthcare Finance
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            <span className="ai-text">AI</span>-powered technology to predict your healthcare costs, optimize insurance, and provide flexible payment solutions.
          </p>
        </div>
      </section>

      {/* Prediction Form */}
      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Your Healthcare Cost Prediction</h2>
            <p className="text-lg text-gray-600">
              {!currentUser ? (
                <>Please <Link to="/login" className="text-primary hover:underline">sign in</Link> to access AI predictions</>
              ) : (
                <>Fill out the form below to receive personalized healthcare cost insights</>
              )}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter your age"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      required
                      disabled={!currentUser}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="income">Annual Income</Label>
                    <Select 
                      value={formData.income} 
                      onValueChange={(value) => handleInputChange('income', value)}
                      disabled={!currentUser}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select income range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-30k">Under $30,000</SelectItem>
                        <SelectItem value="30k-50k">$30,000 - $50,000</SelectItem>
                        <SelectItem value="50k-75k">$50,000 - $75,000</SelectItem>
                        <SelectItem value="75k-100k">$75,000 - $100,000</SelectItem>
                        <SelectItem value="100k-150k">$100,000 - $150,000</SelectItem>
                        <SelectItem value="over-150k">Over $150,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="conditions">Pre-existing Conditions</Label>
                    <Select 
                      value={formData.preExistingConditions} 
                      onValueChange={(value) => handleInputChange('preExistingConditions', value)}
                      disabled={!currentUser}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="minor">Minor (allergies, etc.)</SelectItem>
                        <SelectItem value="moderate">Moderate (diabetes, hypertension)</SelectItem>
                        <SelectItem value="major">Major (heart disease, cancer history)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="lifestyle">Lifestyle</Label>
                    <Select 
                      value={formData.lifestyle} 
                      onValueChange={(value) => handleInputChange('lifestyle', value)}
                      disabled={!currentUser}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select lifestyle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="very-healthy">Very Healthy</SelectItem>
                        <SelectItem value="healthy">Healthy</SelectItem>
                        <SelectItem value="average">Average</SelectItem>
                        <SelectItem value="unhealthy">Unhealthy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="location">Location</Label>
                    <Select 
                      value={formData.location} 
                      onValueChange={(value) => handleInputChange('location', value)}
                      disabled={!currentUser}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sydney">Sydney, NSW</SelectItem>
                        <SelectItem value="melbourne">Melbourne, VIC</SelectItem>
                        <SelectItem value="brisbane">Brisbane, QLD</SelectItem>
                        <SelectItem value="perth">Perth, WA</SelectItem>
                        <SelectItem value="adelaide">Adelaide, SA</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !currentUser}
                >
                  {loading ? 'Processing...' : 'Get AI Prediction'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      {results && (
        <section className="py-20 bg-muted">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Healthcare Financial Insights</h2>
              <p className="text-lg text-gray-600">
                {results.userPlan === 'free' ? 'Basic prediction results' : 'Comprehensive analysis and recommendations'}
              </p>
            </div>
            
            {results.userPlan === 'free' ? renderBasicResults() : renderDetailedResults()}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose FinHealth AI?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our advanced AI technology provides accurate predictions and personalized recommendations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Accurate Predictions</h3>
              <p className="text-gray-600">
                Our AI analyzes thousands of data points to provide highly accurate healthcare cost predictions
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Insurance Optimization</h3>
              <p className="text-gray-600">
                Get personalized insurance recommendations that match your health profile and budget
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Flexible Payments</h3>
              <p className="text-gray-600">
                Access BNPL options to manage healthcare expenses with flexible payment plans
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FinHealthAI;

