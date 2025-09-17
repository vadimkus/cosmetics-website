'use client'

import { useState } from 'react'

export default function AdminUserNotificationEmailTemplate() {
  const [userData, setUserData] = useState({
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    registrationTime: new Date().toLocaleString()
  })

  // Template text content state
  const [templateContent, setTemplateContent] = useState({
    title: 'New User Registration Alert! 🔔',
    mainMessage: 'A new user has registered on genosys.ae.',
    userDetailsTitle: 'User Details',
    quickActionsTitle: 'Quick Actions',
    adminDashboardText: 'View Admin Dashboard',
    adminDashboardUrl: 'https://genosys.ae/admin',
    welcomeEmailText: 'Send Welcome Email',
    statisticsTitle: '📊 User Statistics',
    statisticsMessage: 'This user brings your total registered users to a new milestone! Consider sending them a personalized welcome message or special offer.',
    footerMessage: '',
    companyFooter: 'Genosys Middle East FZ-LLC - Official Genosys distributor in the United Arab Emirates'
  })

  const generateAdminUserNotificationEmail = (data: typeof userData, content: typeof templateContent) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0;">Admin Dashboard</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #92400e; margin: 0 0 15px 0;">${content.title}</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
            ${content.mainMessage}
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #dc2626; margin: 0 0 15px 0;">${content.userDetailsTitle}</h3>
          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #dc2626;">
            <div style="margin-bottom: 10px;">
              <strong style="color: #374151;">Name:</strong>
              <span style="color: #6b7280; margin-left: 8px;">${data.userName}</span>
            </div>
            <div style="margin-bottom: 10px;">
              <strong style="color: #374151;">Email:</strong>
              <span style="color: #6b7280; margin-left: 8px;">${data.userEmail}</span>
            </div>
            <div style="margin-bottom: 0;">
              <strong style="color: #374151;">Registration Time:</strong>
              <span style="color: #6b7280; margin-left: 8px;">${data.registrationTime}</span>
            </div>
          </div>
        </div>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #0369a1; margin: 0 0 15px 0;">${content.quickActionsTitle}</h3>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <a href="${content.adminDashboardUrl}" 
               style="background: #dc2626; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-size: 14px;">
              ${content.adminDashboardText}
            </a>
            <a href="mailto:${data.userEmail}" 
               style="background: #059669; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-size: 14px;">
              ${content.welcomeEmailText}
            </a>
          </div>
        </div>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #dc2626; margin: 0 0 10px 0;">${content.statisticsTitle}</h3>
          <p style="color: #374151; margin: 0; font-size: 14px;">
            ${content.statisticsMessage}
          </p>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            ${content.footerMessage}
          </p>
          <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
            ${content.companyFooter}
          </p>
        </div>
      </div>
    `
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin User Notification Email Template</h1>
          <p className="text-gray-600 mb-6">Preview and customize the admin notification email sent when new users register</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Controls */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Template Variables</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Name
                </label>
                <input
                  type="text"
                  value={userData.userName}
                  onChange={(e) => setUserData({...userData, userName: e.target.value})}
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
                  value={userData.userEmail}
                  onChange={(e) => setUserData({...userData, userEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter user email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Time
                </label>
                <input
                  type="text"
                  value={userData.registrationTime}
                  onChange={(e) => setUserData({...userData, registrationTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter registration time"
                />
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

            {/* Template Content Controls */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Content</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alert Title
                    </label>
                    <input
                      type="text"
                      value={templateContent.title}
                      onChange={(e) => setTemplateContent({...templateContent, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Alert title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Message
                    </label>
                    <textarea
                      value={templateContent.mainMessage}
                      onChange={(e) => setTemplateContent({...templateContent, mainMessage: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Main notification message"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User Details Title
                    </label>
                    <input
                      type="text"
                      value={templateContent.userDetailsTitle}
                      onChange={(e) => setTemplateContent({...templateContent, userDetailsTitle: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="User details section title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quick Actions Title
                    </label>
                    <input
                      type="text"
                      value={templateContent.quickActionsTitle}
                      onChange={(e) => setTemplateContent({...templateContent, quickActionsTitle: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Quick actions section title"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Dashboard Text
                      </label>
                      <input
                        type="text"
                        value={templateContent.adminDashboardText}
                        onChange={(e) => setTemplateContent({...templateContent, adminDashboardText: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Admin dashboard button text"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Dashboard URL
                      </label>
                      <input
                        type="url"
                        value={templateContent.adminDashboardUrl}
                        onChange={(e) => setTemplateContent({...templateContent, adminDashboardUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Admin dashboard URL"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Welcome Email Button Text
                    </label>
                    <input
                      type="text"
                      value={templateContent.welcomeEmailText}
                      onChange={(e) => setTemplateContent({...templateContent, welcomeEmailText: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Welcome email button text"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statistics Title
                    </label>
                    <input
                      type="text"
                      value={templateContent.statisticsTitle}
                      onChange={(e) => setTemplateContent({...templateContent, statisticsTitle: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Statistics section title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statistics Message
                    </label>
                    <textarea
                      value={templateContent.statisticsMessage}
                      onChange={(e) => setTemplateContent({...templateContent, statisticsMessage: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Statistics message"
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Footer
                    </label>
                    <input
                      type="text"
                      value={templateContent.companyFooter}
                      onChange={(e) => setTemplateContent({...templateContent, companyFooter: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Company footer"
                    />
                  </div>
                </div>
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
                    <span className="text-sm text-gray-600 ml-2">New User Registration: {userData.userName}</span>
                  </div>
                </div>
                <div 
                  className="p-4 bg-white max-h-96 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: generateAdminUserNotificationEmail(userData, templateContent) }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* HTML Source */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">HTML Source Code</h3>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{generateAdminUserNotificationEmail(userData, templateContent)}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
