'use client'

import { useState } from 'react'

export default function WelcomeEmailTemplate() {
  const [userName, setUserName] = useState('John Doe')
  const [userEmail, setUserEmail] = useState('5856825@gmail.com')
  
  // Template text content state
  const [templateContent, setTemplateContent] = useState({
    title: 'Welcome, {userName}! 🎉',
    mainMessage: 'Thank you for joining the Genosys Middle East FZ-LLC family! As the official Genosys distributor in the United Arab Emirates, we\'re excited to have you as part of our community.',
    accountMessage: 'Your account has been successfully created with email: {userEmail}',
    nextStepsTitle: 'What\'s Next?',
    nextSteps: [
      'Browse our premium cosmetics collection',
      'Enjoy exclusive member discounts',
      'Get early access to new products',
      'Receive personalized beauty recommendations'
    ],
    buttonText: 'Start Shopping',
    buttonUrl: 'https://genosys.ae/products',
    supportMessage: 'Need help? Contact us at sales@genosys.ae',
    footerMessage: 'Genosys Middle East FZ-LLC - Official Genosys distributor in the United Arab Emirates'
  })

  const generateWelcomeEmail = (name: string, email: string, content: typeof templateContent) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0;">Official Genosys distributor in the United Arab Emirates</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #dc2626; margin: 0 0 15px 0;">${content.title.replace('{userName}', name)}</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            ${content.mainMessage}
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
            ${content.accountMessage.replace('{userEmail}', email)}
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #dc2626; margin: 0 0 15px 0;">${content.nextStepsTitle}</h3>
          <ul style="color: #374151; line-height: 1.8; margin: 0; padding-left: 20px;">
            ${content.nextSteps.map(step => `<li>${step}</li>`).join('')}
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${content.buttonUrl}" 
             style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    font-weight: bold; 
                    display: inline-block;">
            ${content.buttonText}
          </a>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            ${content.supportMessage.replace('sales@genosys.ae', '<a href="mailto:sales@genosys.ae" style="color: #dc2626;">sales@genosys.ae</a>')}
          </p>
          <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
            ${content.footerMessage}
          </p>
        </div>
      </div>
    `
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Email Template</h1>
          <p className="text-gray-600 mb-6">Preview and customize the welcome email sent to new users</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Controls */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Variables</h3>
                <div className="space-y-4">
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
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Content</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Welcome Title
                    </label>
                    <input
                      type="text"
                      value={templateContent.title}
                      onChange={(e) => setTemplateContent({...templateContent, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Welcome title (use {userName} for dynamic name)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Message
                    </label>
                    <textarea
                      value={templateContent.mainMessage}
                      onChange={(e) => setTemplateContent({...templateContent, mainMessage: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Main welcome message"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Message
                    </label>
                    <textarea
                      value={templateContent.accountMessage}
                      onChange={(e) => setTemplateContent({...templateContent, accountMessage: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Account creation message (use {userEmail} for dynamic email)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Next Steps Title
                    </label>
                    <input
                      type="text"
                      value={templateContent.nextStepsTitle}
                      onChange={(e) => setTemplateContent({...templateContent, nextStepsTitle: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Next steps section title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Next Steps (one per line)
                    </label>
                    <textarea
                      value={templateContent.nextSteps.join('\n')}
                      onChange={(e) => setTemplateContent({...templateContent, nextSteps: e.target.value.split('\n').filter(step => step.trim())})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="List next steps, one per line"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={templateContent.buttonText}
                        onChange={(e) => setTemplateContent({...templateContent, buttonText: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Button text"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button URL
                      </label>
                      <input
                        type="url"
                        value={templateContent.buttonUrl}
                        onChange={(e) => setTemplateContent({...templateContent, buttonUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Button URL"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Support Message
                    </label>
                    <input
                      type="text"
                      value={templateContent.supportMessage}
                      onChange={(e) => setTemplateContent({...templateContent, supportMessage: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Support contact message"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Footer Message
                    </label>
                    <input
                      type="text"
                      value={templateContent.footerMessage}
                      onChange={(e) => setTemplateContent({...templateContent, footerMessage: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Footer message"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  onClick={() => {
                    alert('Template saved! (Functionality to be implemented)')
                  }}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                >
                  Save Template
                </button>
              </div>
            </div>
            
            {/* Preview */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Preview</h3>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 ml-2">Welcome to Genosys Middle East FZ-LLC! 🎉</span>
                  </div>
                </div>
                <div 
                  className="p-4 bg-white max-h-96 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: generateWelcomeEmail(userName, userEmail, templateContent) }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* HTML Source */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">HTML Source Code</h3>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{generateWelcomeEmail(userName, userEmail, templateContent)}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
