import { Callout } from 'nextra/components'

# Login & Ticket Sync

The **Login & Ticket Sync** screen acts as the gateway to the Lattice platform. It is designed to handle secure authentication and link admission tickets, updating user permissions in the system database.

## Screen Mockups

<div style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '12px 0' }}>
  <img src="/assets/mockups/welcome-3.png" alt="Welcome Onboarding Flow" style={{ height: '540px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} />
  <img src="/assets/mockups/tickets-1.png" alt="Ticket Synchronization Panel" style={{ height: '540px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} />
</div>



## Interactive Design Details

*   **Vibrant Mesh Gradient Background**: Simulates an abstract dark-space background with floating blur lights in primary red, creating a premium and modern high-quality first impression.
*   **Racing Logo Header**: A custom racing-helmet icon styled with a linear gradient and glowing shadow, alongside the title *"Welcome to the Grid"*.
*   **Dual Mode Glass Selector**:
    *   **Fast Ticket Sync (Active)**: A minimal interface to immediately input a ticket code or activate the QR/Barcode scanner via camera.
    *   **Account Sync**: A tab to login using existing credentials (email and password hash validation).
*   **Dynamic Float Form Inputs**: Custom stylized bottom-bordered text inputs that feature micro-animations on focus, transforming labels and shifting border colors to red.
*   **QR Scanner Button**: Direct camera activation shortcut represented by `qr_code_scanner` to quickly parse tickets.
*   **Information Helper Banner**: Combines instructions for users (*"Use the 8-digit code found on your physical pass or email confirmation"*).
*   **Third-Party Authentication**: Seamlessly integrates Apple and Google SSO (Single Sign-On) options represented by custom SVG icons on slate buttons.
*   **Footer Status Tag**: Displays a subtle spin animated badge showing *"AR Experience Ready"*, verifying that local hardware sensors support augmented reality.

---

<Callout type="info">
The HTML prototype of this screen can be found in the repository at [code.html](./code.html).
</Callout>

