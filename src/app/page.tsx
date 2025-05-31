'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Shield,
  Users,
  MapPin,
  MessageSquare,
  Zap,
  Eye,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Clock,
  AlertTriangle,
  Heart,
  Globe,
  Database,
  Smartphone
} from 'lucide-react';

const RescueLankaLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Image src="/logo.png" alt="Rescue Lanka Logo"
                width={200} height={100}
              />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-red-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-red-600 transition-colors">How It Works</a>
              <a href="#users" className="text-gray-700 hover:text-red-600 transition-colors">For Users</a>
              <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-red-600">Features</a>
                <a href="#how-it-works" className="block px-3 py-2 text-gray-700 hover:text-red-600">How It Works</a>
                <a href="#users" className="block px-3 py-2 text-gray-700 hover:text-red-600">For Users</a>
                <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-red-600">Contact</a>
                <button className="w-full text-left bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors mt-2">
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              AI-Powered
              <span className="block text-red-600">Disaster Response</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing emergency coordination with intelligent systems that save lives,
              streamline resources, and connect communities during critical moments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                Launch Platform
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-red-600 hover:text-red-600 transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">90% Faster</h3>
              <p className="text-gray-600">Response coordination time</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">10K+</h3>
              <p className="text-gray-600">Lives impacted positively</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">24/7</h3>
              <p className="text-gray-600">Automated monitoring</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful AI-Driven Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced technology meets humanitarian response with intelligent coordination and real-time processing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MessageSquare,
                title: "Intelligent Request Processing",
                description: "AI-powered analysis of text, images, and voice inputs to extract critical information and prioritize responses automatically.",
                color: "bg-blue-100 text-blue-600"
              },
              {
                icon: MapPin,
                title: "Real-Time Coordination Dashboard",
                description: "Interactive map-based interface showing geolocated requests, ongoing missions, and resource deployment in real-time.",
                color: "bg-red-100 text-red-600"
              },
              {
                icon: Eye,
                title: "Vision-Language Integration",
                description: "Advanced computer vision models extract actionable insights from disaster scene images and videos.",
                color: "bg-purple-100 text-purple-600"
              },
              {
                icon: Zap,
                title: "Automated Task Assignment",
                description: "Smart algorithms match resources with needs, optimizing response efficiency and reducing coordination overhead.",
                color: "bg-yellow-100 text-yellow-600"
              },
              {
                icon: Smartphone,
                title: "Offline-First Design",
                description: "Critical functionality works without internet connection, with automatic sync when connectivity is restored.",
                color: "bg-green-100 text-green-600"
              },
              {
                icon: Database,
                title: "Multi-Modal Data Processing",
                description: "Process and analyze diverse data sources including text reports, images, audio, and sensor data seamlessly.",
                color: "bg-indigo-100 text-indigo-600"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Rescue Lanka Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A streamlined process that transforms chaos into coordinated response
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Report Incident",
                description: "Submit help requests via text, images, or voice through our intuitive interface",
                icon: AlertTriangle
              },
              {
                step: "02",
                title: "AI Analysis",
                description: "Our AI processes and prioritizes requests based on urgency, location, and available resources",
                icon: Eye
              },
              {
                step: "03",
                title: "Smart Assignment",
                description: "Automated task distribution to first responders and volunteers with optimal routing",
                icon: Users
              },
              {
                step: "04",
                title: "Real-Time Updates",
                description: "Live tracking and communication throughout the entire response process",
                icon: MessageSquare
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.step}
                </div>
                <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Groups Section */}
      <section id="users" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Everyone</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Designed to serve all stakeholders in disaster response coordination
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "First Responders",
                description: "Receive prioritized tasks, analyze reports, and coordinate resource deployment efficiently",
                icon: Shield,
                features: ["Task prioritization", "Resource tracking", "Real-time updates", "Mobile optimization"]
              },
              {
                title: "Volunteers",
                description: "Register, receive assignments, and report field observations with guided workflows",
                icon: Heart,
                features: ["Easy registration", "Assignment matching", "Field reporting", "Training resources"]
              },
              {
                title: "Affected Individuals",
                description: "Submit help requests and receive updates through multiple communication channels",
                icon: Users,
                features: ["Multi-modal requests", "Status updates", "Direct messaging", "Offline capability"]
              },
              {
                title: "Government Centers",
                description: "Administer the platform and oversee coordination through comprehensive dashboards",
                icon: Globe,
                features: ["Admin dashboard", "Analytics & insights", "Resource management", "System oversight"]
              }
            ].map((user, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <user.icon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{user.title}</h3>
                <p className="text-gray-600 mb-4">{user.description}</p>
                <ul className="space-y-2">
                  {user.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Emergency Response?</h2>
          <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
            Join the revolution in disaster coordination. Help us build a more resilient and connected world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-white text-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-red-600 transition-all duration-300">
              Request Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-800 mt-1 pt-1 text-center text-gray-400">
            <p> Built with ❤️ for humanity.</p>
            <p>&copy; 2025 CodeLabs. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RescueLankaLanding;