import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const Pricing = () => {
  const pricingPlans = [
    {
      name: 'Free Plan',
      price: '$0/month',
      features: [
        'Basic health tracking',
        'Basic medical cost prediction',
        'Basic nutrition suggestions',
        'Email support',
      ],
      isPremium: false,
    },
    {
      name: 'Premium Plan',
      price: '$19.99/month',
      features: [
        'All Free Plan features',
        'Detailed medical cost prediction',
        'Insurance optimization',
        'BNPL for healthcare',
        'Personalized AI nutrition',
        'Wearable device integration',
        '24/7 support',
      ],
      isPremium: true,
    },
    {
      name: 'Enterprise Plan',
      price: 'Contact for pricing',
      features: [
        'API for businesses',
        'System integration',
        'Advanced reports and analytics',
        'Dedicated technical support',
        'Customizable solutions',
      ],
      isPremium: false,
    },
  ];

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-muted to-secondary/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-primary">Pricing</span> Plans
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that best fits your needs and start your journey towards smarter healthcare and nutrition management.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`flex flex-col ${plan.isPremium ? 'border-primary border-2 shadow-lg' : ''}`}>
                <CardContent className="p-8 flex-grow">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    {plan.name}
                  </h3>
                  <p className="text-4xl font-bold text-center mb-6">
                    {plan.price}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.isPremium ? 'bg-primary hover:bg-primary/90' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
                    {plan.name === 'Enterprise Plan' ? 'Contact Sales' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;

