'use client'

import { useState } from 'react'

export default function EmailTemplatePage() {
  const [userName, setUserName] = useState('John Doe')
  const [userEmail, setUserEmail] = useState('user@example.com')
  const [password, setPassword] = useState('MySecurePassword123!')

  // Generate welcome email template (same as in lib/email.ts)
  const generateWelcomeEmail = (name: string, email: string, pwd?: string) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    return {
      subject: 'Account details > Genosys Middle East FZ-LLC',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #dc2626;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0;">United Arab Emirates <span style="font-size: 0.8em;">❤️</span></p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #374151; margin: 0 0 15px 0;">Welcome, ${name}!</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Registration is done. Thank you for joining.
          </p>
          ${pwd ? `
          <div style="background: #f9fafb; padding: 18px 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
            <h3 style="color: #374151; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Account details:</h3>
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0;">
              <span style="color: #9ca3af;">login:</span> <strong style="color: #374151;">${email}</strong>
            </p>
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0;">
              <span style="color: #9ca3af;">password:</span> <strong style="color: #374151; font-family: 'Courier New', monospace; letter-spacing: 0.5px;">${pwd}</strong>
            </p>
          </div>
          ` : ''}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/products" 
             style="background: #dc2626; 
                    color: white; 
                    padding: 10px 24px; 
                    text-decoration: none; 
                    border-radius: 4px; 
                    font-weight: bold; 
                    font-size: 14px;
                    display: inline-block;
                    letter-spacing: 0.3px;">
            Login
          </a>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <img src="https://genosys.ae/_next/image?url=%2FLogo%2FupLOGO.png&w=384&q=75" alt="Genosys Logo" style="max-width: 170px; height: auto; margin: 0 auto 15px; display: block;" />
          <p style="color: #6b7280; font-size: 14px; margin: 8px 0;">
            Official Distributor in the UAE.
          </p>
          <p style="color: #6b7280; font-size: 12px; margin: 8px 0 0;">
            © 2026 Genosys Middle East FZ-LLC. All rights reserved.
          </p>
        </div>
      </div>
    `
    }
  }

  const template = generateWelcomeEmail(userName, userEmail, password)

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Confirmation Template</h1>
          <p className="text-gray-600 mb-4">
            This is the email template that users receive when they register with Genosys
          </p>
          
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter user name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Email
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter user email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter password"
              />
            </div>
          </div>
        </div>

        {/* Email Preview */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Email Header Bar */}
          <div className="bg-gray-200 px-4 py-3 border-b border-gray-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700 ml-3 font-medium">Email Preview</span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Subject:</span> {template.subject}
              </div>
            </div>
          </div>
          
          {/* Email Content */}
          <div className="p-8 bg-white">
            <div 
              className="max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{ __html: template.html }}
            />
          </div>
        </div>

        {/* Email Details */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Email Details</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">Subject:</span>
              <span className="ml-2 text-gray-600">{template.subject}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Recipient:</span>
              <span className="ml-2 text-gray-600">{userEmail}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Template:</span>
              <span className="ml-2 text-gray-600">Welcome Email (Registration Confirmation)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
