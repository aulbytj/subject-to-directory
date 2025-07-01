"use client";

import { useState, useEffect } from 'react';
import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Home,
  Percent,
  PieChart,
  Info,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function CalculatorsPage() {
  // Cash Flow Calculator State
  const [propertyValue, setPropertyValue] = useState(300000);
  const [existingLoanBalance, setExistingLoanBalance] = useState(250000);
  const [monthlyPayment, setMonthlyPayment] = useState(1200);
  const [monthlyRent, setMonthlyRent] = useState(1800);
  const [monthlyExpenses, setMonthlyExpenses] = useState(400);
  const [initialCosts, setInitialCosts] = useState(5000);
  
  // Cash-on-Cash Return State
  const [cashInvested, setCashInvested] = useState(15000);
  
  // Cap Rate Calculator State
  const [annualRent, setAnnualRent] = useState(21600);
  const [annualExpenses, setAnnualExpenses] = useState(4800);
  
  // Subject-To Specific State
  const [backPayments, setBackPayments] = useState(0);
  const [closingCosts, setClosingCosts] = useState(3000);
  const [repairCosts, setRepairCosts] = useState(8000);
  
  // Payment Calculator State
  const [interestRate, setInterestRate] = useState(3.5);
  const [loanTerm, setLoanTerm] = useState(30);
  
  // Calculation states
  const [cashFlowResults, setCashFlowResults] = useState<any>(null);
  const [returnsResults, setReturnsResults] = useState<any>(null);
  const [dealResults, setDealResults] = useState<any>(null);
  const [paymentResults, setPaymentResults] = useState<any>(null);

  // Cash Flow Calculations
  const calculateCashFlow = () => {
    const monthlyProfit = monthlyRent - monthlyPayment - monthlyExpenses;
    const annualCashFlow = monthlyProfit * 12;
    const equity = propertyValue - existingLoanBalance;
    
    return {
      monthlyProfit,
      annualCashFlow,
      equity,
    };
  };

  // Cash-on-Cash Return Calculations
  const calculateCashOnCash = () => {
    const { annualCashFlow } = calculateCashFlow();
    const totalCashInvested = cashInvested + initialCosts + backPayments + closingCosts + repairCosts;
    const cashOnCashReturn = totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0;
    
    return {
      cashOnCashReturn,
      totalCashInvested,
    };
  };

  // Cap Rate Calculations
  const calculateCapRate = () => {
    const netOperatingIncome = annualRent - annualExpenses;
    const capRate = propertyValue > 0 ? (netOperatingIncome / propertyValue) * 100 : 0;
    
    return {
      netOperatingIncome,
      capRate,
    };
  };

  // Subject-To Deal Analysis
  const calculateSubjectToDeal = () => {
    const { equity, monthlyProfit, annualCashFlow } = calculateCashFlow();
    const { cashOnCashReturn, totalCashInvested } = calculateCashOnCash();
    const { capRate } = calculateCapRate();
    
    // Investment rules evaluation
    const onePercentRule = (monthlyRent / propertyValue) * 100;
    const fiftyPercentRule = (monthlyExpenses / monthlyRent) * 100;
    
    // Risk assessment
    const getRiskLevel = () => {
      if (cashOnCashReturn > 15 && capRate > 8 && monthlyProfit > 200) return 'Low';
      if (cashOnCashReturn > 10 && capRate > 6 && monthlyProfit > 100) return 'Moderate';
      return 'High';
    };
    
    return {
      equity,
      monthlyProfit,
      annualCashFlow,
      cashOnCashReturn,
      totalCashInvested,
      capRate,
      onePercentRule,
      fiftyPercentRule,
      riskLevel: getRiskLevel(),
    };
  };

  // Button handlers for calculations
  const handleCalculateCashFlow = () => {
    const results = calculateCashFlow();
    setCashFlowResults(results);
  };

  const handleCalculateReturns = () => {
    const cashFlow = calculateCashFlow();
    const returns = calculateCashOnCash();
    const capRate = calculateCapRate();
    setReturnsResults({ ...returns, ...capRate });
  };

  const handleCalculateDeal = () => {
    const results = calculateSubjectToDeal();
    setDealResults(results);
  };

  const handleCalculatePayment = () => {
    const payment = calculateMortgagePayment(existingLoanBalance, interestRate, loanTerm);
    setPaymentResults({ monthlyPayment: payment });
  };

  // Input change handlers for each field - using separate state for display values
  const [propertyValueDisplay, setPropertyValueDisplay] = useState('300000');
  const [existingLoanDisplay, setExistingLoanDisplay] = useState('250000');
  const [monthlyPaymentDisplay, setMonthlyPaymentDisplay] = useState('1200');
  const [monthlyRentDisplay, setMonthlyRentDisplay] = useState('1800');
  const [monthlyExpensesDisplay, setMonthlyExpensesDisplay] = useState('400');
  const [initialCostsDisplay, setInitialCostsDisplay] = useState('5000');
  
  const [cashInvestedDisplay, setCashInvestedDisplay] = useState('15000');
  const [backPaymentsDisplay, setBackPaymentsDisplay] = useState('0');
  const [closingCostsDisplay, setClosingCostsDisplay] = useState('3000');
  const [repairCostsDisplay, setRepairCostsDisplay] = useState('8000');
  const [annualRentDisplay, setAnnualRentDisplay] = useState('21600');
  const [annualExpensesDisplay, setAnnualExpensesDisplay] = useState('4800');
  
  const [interestRateDisplay, setInterestRateDisplay] = useState('3.5');
  const [loanTermDisplay, setLoanTermDisplay] = useState('30');

  // Generic handler for text inputs with number validation
  const createInputHandler = (displaySetter: (value: string) => void, valueSetter: (value: number) => void) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      // Allow empty string, numbers, and decimals
      if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
        displaySetter(inputValue);
        const numericValue = inputValue === '' ? 0 : parseFloat(inputValue) || 0;
        valueSetter(numericValue);
      }
    };


  // Payment Calculator
  const calculateMortgagePayment = (principal: number, rate: number, years: number) => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    
    if (monthlyRate === 0) return principal / numPayments;
    
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Calculator className="mr-2 h-4 w-4" />
            Financial Calculators
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Subject-To Deal Analysis Tools
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive calculators for analyzing subject-to real estate deals, cash flow, and investment returns.
          </p>
        </div>

        <Tabs defaultValue="cash-flow" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
            <TabsTrigger value="returns">Returns</TabsTrigger>
            <TabsTrigger value="deal-analysis">Deal Analysis</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>

          {/* Cash Flow Calculator */}
          <TabsContent value="cash-flow">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5 text-green-600" />
                    Cash Flow Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate monthly and annual cash flow for your subject-to deal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="propertyValue" className="text-gray-700">Property Value</Label>
                      <input
                        id="propertyValue"
                        type="text"
                        inputMode="decimal"
                        value={propertyValueDisplay}
                        onChange={createInputHandler(setPropertyValueDisplay, setPropertyValue)}
                        placeholder="300000"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="existingLoan" className="text-gray-700">Existing Loan Balance</Label>
                      <input
                        id="existingLoan"
                        type="text"
                        inputMode="decimal"
                        value={existingLoanDisplay}
                        onChange={createInputHandler(setExistingLoanDisplay, setExistingLoanBalance)}
                        placeholder="250000"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="monthlyPayment" className="text-gray-700">Monthly Payment</Label>
                      <input
                        id="monthlyPayment"
                        type="text"
                        inputMode="decimal"
                        value={monthlyPaymentDisplay}
                        onChange={createInputHandler(setMonthlyPaymentDisplay, setMonthlyPayment)}
                        placeholder="1200"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlyRent" className="text-gray-700">Monthly Rent</Label>
                      <input
                        id="monthlyRent"
                        type="text"
                        inputMode="decimal"
                        value={monthlyRentDisplay}
                        onChange={createInputHandler(setMonthlyRentDisplay, setMonthlyRent)}
                        placeholder="1800"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="monthlyExpenses" className="text-gray-700">Monthly Expenses</Label>
                      <input
                        id="monthlyExpenses"
                        type="text"
                        inputMode="decimal"
                        value={monthlyExpensesDisplay}
                        onChange={createInputHandler(setMonthlyExpensesDisplay, setMonthlyExpenses)}
                        placeholder="400"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="initialCosts" className="text-gray-700">Initial Costs</Label>
                      <input
                        id="initialCosts"
                        type="text"
                        inputMode="decimal"
                        value={initialCostsDisplay}
                        onChange={createInputHandler(setInitialCostsDisplay, setInitialCosts)}
                        placeholder="5000"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleCalculateCashFlow} className="w-full">
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate Cash Flow
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
                    Cash Flow Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cashFlowResults ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            ${cashFlowResults.monthlyProfit.toLocaleString()}
                          </div>
                          <div className="text-sm text-green-700">Monthly Cash Flow</div>
                          {cashFlowResults.monthlyProfit > 0 && (
                            <CheckCircle className="h-4 w-4 text-green-600 mx-auto mt-1" />
                          )}
                        </div>
                        <div className="text-center p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            ${cashFlowResults.annualCashFlow.toLocaleString()}
                          </div>
                          <div className="text-sm text-blue-700">Annual Cash Flow</div>
                          {cashFlowResults.annualCashFlow > 0 && (
                            <CheckCircle className="h-4 w-4 text-blue-600 mx-auto mt-1" />
                          )}
                        </div>
                      </div>
                      
                      <div className="text-center p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          ${cashFlowResults.equity.toLocaleString()}
                        </div>
                        <div className="text-sm text-purple-700">Immediate Equity</div>
                        {cashFlowResults.equity > 0 && (
                          <CheckCircle className="h-4 w-4 text-purple-600 mx-auto mt-1" />
                        )}
                      </div>
                      
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          <strong>50% Rule Check:</strong> Monthly expenses should be ~50% of rent. 
                          Current: {((monthlyExpenses / monthlyRent) * 100).toFixed(1)}%
                        </AlertDescription>
                      </Alert>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Enter your values and click "Calculate Cash Flow" to see results</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Returns Calculator */}
          <TabsContent value="returns">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Percent className="mr-2 h-5 w-5 text-orange-600" />
                    Returns Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate cash-on-cash return and cap rate
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cashInvested" className="text-gray-700">Cash Invested</Label>
                      <input
                        id="cashInvested"
                        type="text"
                        inputMode="decimal"
                        value={cashInvestedDisplay}
                        onChange={createInputHandler(setCashInvestedDisplay, setCashInvested)}
                        placeholder="15000"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backPayments" className="text-gray-700">Back Payments</Label>
                      <input
                        id="backPayments"
                        type="text"
                        inputMode="decimal"
                        value={backPaymentsDisplay}
                        onChange={createInputHandler(setBackPaymentsDisplay, setBackPayments)}
                        placeholder="0"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="closingCosts" className="text-gray-700">Closing Costs</Label>
                      <input
                        id="closingCosts"
                        type="text"
                        inputMode="decimal"
                        value={closingCostsDisplay}
                        onChange={createInputHandler(setClosingCostsDisplay, setClosingCosts)}
                        placeholder="3000"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="repairCosts" className="text-gray-700">Repair Costs</Label>
                      <input
                        id="repairCosts"
                        type="text"
                        inputMode="decimal"
                        value={repairCostsDisplay}
                        onChange={createInputHandler(setRepairCostsDisplay, setRepairCosts)}
                        placeholder="8000"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="annualRent" className="text-gray-700">Annual Rent</Label>
                      <input
                        id="annualRent"
                        type="text"
                        inputMode="decimal"
                        value={annualRentDisplay}
                        onChange={createInputHandler(setAnnualRentDisplay, setAnnualRent)}
                        placeholder="21600"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="annualExpenses" className="text-gray-700">Annual Expenses</Label>
                      <input
                        id="annualExpenses"
                        type="text"
                        inputMode="decimal"
                        value={annualExpensesDisplay}
                        onChange={createInputHandler(setAnnualExpensesDisplay, setAnnualExpenses)}
                        placeholder="4800"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <Button onClick={handleCalculateReturns} className="w-full">
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate Returns
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="mr-2 h-5 w-5 text-purple-600" />
                    Return Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {returnsResults ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">
                            {returnsResults.cashOnCashReturn.toFixed(1)}%
                          </div>
                          <div className="text-sm text-orange-700">Cash-on-Cash Return</div>
                        </div>
                        <div className="text-center p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg">
                          <div className="text-2xl font-bold text-indigo-600">
                            {returnsResults.capRate.toFixed(1)}%
                          </div>
                          <div className="text-sm text-indigo-700">Cap Rate</div>
                        </div>
                      </div>
                      
                      <div className="text-center p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
                        <div className="text-2xl font-bold text-gray-600">
                          ${returnsResults.totalCashInvested.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-700">Total Cash Invested</div>
                      </div>
                      
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          <strong>1% Rule Check:</strong> Monthly rent should be ~1% of property value. 
                          Current: {((monthlyRent / propertyValue) * 100).toFixed(2)}%
                        </AlertDescription>
                      </Alert>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Percent className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Enter your values and click "Calculate Returns" to see results</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Deal Analysis */}
          <TabsContent value="deal-analysis">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="mr-2 h-5 w-5 text-blue-600" />
                  Complete Deal Analysis
                </CardTitle>
                <CardDescription>
                  Comprehensive analysis of your subject-to deal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button onClick={handleCalculateDeal} className="w-full mb-6">
                  <Calculator className="mr-2 h-4 w-4" />
                  Analyze Complete Deal
                </Button>

                {dealResults ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                        <div className="text-xl font-bold text-green-600">
                          ${dealResults.monthlyProfit.toLocaleString()}
                        </div>
                        <div className="text-sm text-green-700">Monthly Cash Flow</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
                        <div className="text-xl font-bold text-orange-600">
                          {dealResults.cashOnCashReturn.toFixed(1)}%
                        </div>
                        <div className="text-sm text-orange-700">Cash-on-Cash Return</div>
                      </div>
                      <div className="text-center p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg">
                        <div className="text-xl font-bold text-indigo-600">
                          {dealResults.capRate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-indigo-700">Cap Rate</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                        <div className="text-xl font-bold text-purple-600">
                          ${dealResults.equity.toLocaleString()}
                        </div>
                        <div className="text-sm text-purple-700">Immediate Equity</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Investment Rules Analysis</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <span>1% Rule</span>
                            <div className="flex items-center">
                              <span className="mr-2">{dealResults.onePercentRule.toFixed(2)}%</span>
                              {dealResults.onePercentRule >= 1 ? 
                                <CheckCircle className="h-4 w-4 text-green-600" /> : 
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                              }
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <span>50% Rule</span>
                            <div className="flex items-center">
                              <span className="mr-2">{dealResults.fiftyPercentRule.toFixed(1)}%</span>
                              {dealResults.fiftyPercentRule <= 50 ? 
                                <CheckCircle className="h-4 w-4 text-green-600" /> : 
                                <AlertTriangle className="h-4 w-4 text-orange-600" />
                              }
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Risk Assessment</h3>
                        <div className={`p-4 rounded-lg ${
                          dealResults.riskLevel === 'Low' ? 'bg-green-50 text-green-800' :
                          dealResults.riskLevel === 'Moderate' ? 'bg-yellow-50 text-yellow-800' :
                          'bg-red-50 text-red-800'
                        }`}>
                          <div className="font-semibold">Risk Level: {dealResults.riskLevel}</div>
                          <div className="text-sm mt-1">
                            {dealResults.riskLevel === 'Low' && 'Excellent returns and cash flow. Low risk investment.'}
                            {dealResults.riskLevel === 'Moderate' && 'Good returns with manageable risk. Monitor closely.'}
                            {dealResults.riskLevel === 'High' && 'Higher risk investment. Consider additional analysis.'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Deal Summary</h4>
                      <div className="text-sm space-y-1">
                        <div>• Property Value: ${propertyValue.toLocaleString()}</div>
                        <div>• Existing Loan: ${existingLoanBalance.toLocaleString()}</div>
                        <div>• Total Cash Required: ${dealResults.totalCashInvested.toLocaleString()}</div>
                        <div>• Monthly Cash Flow: ${dealResults.monthlyProfit.toLocaleString()}</div>
                        <div>• Annual Return: {dealResults.cashOnCashReturn.toFixed(1)}%</div>
                        <div>• Loan-to-Value Ratio: {((existingLoanBalance / propertyValue) * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Home className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Enter all your property details in the other tabs, then click "Analyze Complete Deal" to see comprehensive analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Calculator */}
          <TabsContent value="payment">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="mr-2 h-5 w-5 text-green-600" />
                    Mortgage Payment Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate mortgage payments for different scenarios
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="loanAmount" className="text-gray-700">Loan Amount</Label>
                      <input
                        id="loanAmount"
                        type="text"
                        inputMode="decimal"
                        value={existingLoanDisplay}
                        onChange={createInputHandler(setExistingLoanDisplay, setExistingLoanBalance)}
                        placeholder="250000"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="interestRate" className="text-gray-700">Interest Rate (%)</Label>
                        <input
                          id="interestRate"
                          type="text"
                          inputMode="decimal"
                          value={interestRateDisplay}
                          onChange={createInputHandler(setInterestRateDisplay, setInterestRate)}
                          placeholder="3.5"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="loanTerm" className="text-gray-700">Loan Term (years)</Label>
                        <input
                          id="loanTerm"
                          type="text"
                          inputMode="decimal"
                          value={loanTermDisplay}
                          onChange={createInputHandler(setLoanTermDisplay, setLoanTerm)}
                          placeholder="30"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={handleCalculatePayment} className="w-full">
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate Payment
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentResults ? (
                    <>
                      <div className="text-center p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600">
                          ${paymentResults.monthlyPayment.toFixed(2)}
                        </div>
                        <div className="text-blue-700">Monthly Payment (P&I)</div>
                        <div className="text-sm text-blue-600 mt-2">
                          {loanTerm}-year fixed @ {interestRate}%
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold mb-2">Payment Breakdown</h4>
                        <div className="text-sm space-y-1">
                          <div>• Principal & Interest: ${paymentResults.monthlyPayment.toFixed(2)}</div>
                          <div>• Property Tax: ~$300-500/month</div>
                          <div>• Insurance: ~$100-200/month</div>
                          <div>• Total PITI: ~${(paymentResults.monthlyPayment + 400).toFixed(2)}</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Enter loan details and click "Calculate Payment" to see results</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}