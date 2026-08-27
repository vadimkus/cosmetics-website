import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { errorLog } from '@/lib/logger'

/**
 * Apple Wallet Pass Generation
 * GET /api/mobile/membership/wallet-pass
 *
 * Returns a .pkpass file that iOS can add to Apple Wallet.
 * On the mobile app, call: Linking.openURL(passUrl) - iOS handles the rest.
 *
 * SETUP REQUIRED:
 * 1. Apple Developer Portal → Certificates → Pass Type IDs → create one (e.g. pass.ae.genosys.membership)
 * 2. Generate a signing certificate for that Pass Type ID
 * 3. Download Apple WWDR intermediate certificate
 * 4. Set env vars:
 *    - APPLE_PASS_TYPE_ID=pass.ae.genosys.membership
 *    - APPLE_TEAM_ID=YOUR_TEAM_ID
 *    - APPLE_PASS_CERT_PATH=./certs/pass.pem
 *    - APPLE_PASS_KEY_PATH=./certs/pass-key.pem
 *    - APPLE_WWDR_CERT_PATH=./certs/wwdr.pem
 * 5. Install passkit-generator: npm install passkit-generator
 */
export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key')
    const authHeader = request.headers.get('Authorization')
    const token = extractTokenFromHeader(authHeader)
    const auth = validateMobileAuth(apiKey, token)

    if (!auth.valid || !auth.payload) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.payload.userId },
      select: {
        name: true,
        email: true,
        memberNumber: true,
        memberTier: true,
        memberSince: true,
      },
    })

    if (!user?.memberNumber) {
      return NextResponse.json({ success: false, error: 'No membership found' }, { status: 404 })
    }

    const passTypeId = process.env.APPLE_PASS_TYPE_ID
    if (!passTypeId) {
      return NextResponse.json(
        { success: false, error: 'Apple Wallet not configured. Pass Type ID certificates required.' },
        { status: 503 },
      )
    }

    // When passkit-generator is installed and certificates are configured,
    // uncomment and complete the pass generation below:
    //
    // const { PKPass } = await import('passkit-generator')
    // const pass = new PKPass({}, {
    //   wwdr: fs.readFileSync(process.env.APPLE_WWDR_CERT_PATH!),
    //   signerCert: fs.readFileSync(process.env.APPLE_PASS_CERT_PATH!),
    //   signerKey: fs.readFileSync(process.env.APPLE_PASS_KEY_PATH!),
    // }, {
    //   serialNumber: user.memberNumber,
    //   description: 'GENOSYS Membership Card',
    //   organizationName: 'GENOSYS Middle East',
    //   passTypeIdentifier: passTypeId,
    //   teamIdentifier: process.env.APPLE_TEAM_ID!,
    //   foregroundColor: 'rgb(255, 255, 255)',
    //   backgroundColor: 'rgb(10, 10, 10)',
    //   labelColor: 'rgb(201, 169, 110)',
    // })
    // pass.type = 'generic'
    // pass.primaryFields.push({ key: 'name', label: 'MEMBER', value: user.name })
    // pass.secondaryFields.push({ key: 'number', label: 'MEMBER NO.', value: user.memberNumber })
    // pass.auxiliaryFields.push({ key: 'tier', label: 'TIER', value: user.memberTier })
    // pass.auxiliaryFields.push({ key: 'since', label: 'SINCE', value: user.memberSince?.toISOString().slice(0,7) || '' })
    // pass.setBarcodes({ format: 'PKBarcodeFormatQR', message: user.memberNumber, messageEncoding: 'iso-8859-1' })
    //
    // const buf = pass.getAsBuffer()
    // return new NextResponse(buf, {
    //   headers: {
    //     'Content-Type': 'application/vnd.apple.pkpass',
    //     'Content-Disposition': `attachment; filename="genosys-${user.memberNumber}.pkpass"`,
    //   },
    // })

    return NextResponse.json({
      success: false,
      error: 'Apple Wallet pass generation is pending certificate setup. Contact admin.',
    }, { status: 503 })
  } catch (error) {
    errorLog('[WALLET_PASS] Error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
