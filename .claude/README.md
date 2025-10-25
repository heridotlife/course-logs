# Claude Code Configuration

This directory contains configuration files for Claude Code and Model Context Protocol (MCP) servers.

## MCP Configuration

The `mcp.json` file configures MCP servers that provide Claude Code with access to Cloudflare services.

### Available Cloudflare MCP Servers

1. **cloudflare-pages** - Manage Cloudflare Pages deployments
   - List deployments
   - View deployment details
   - Trigger new deployments
   - Check deployment status

2. **cloudflare-analytics** - Access website analytics
   - View traffic statistics
   - Monitor performance metrics
   - Analyze visitor data

3. **cloudflare-workers** - Manage Workers and bindings
   - List Workers
   - View Worker details
   - Manage KV, R2, D1, and other bindings

4. **cloudflare-dns** - Manage DNS records
   - List DNS records
   - Add/update/delete records
   - View DNS configuration

### Setup Instructions

#### 1. Get Your Cloudflare API Token

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **My Profile** → **API Tokens**
3. Click **Create Token**
4. Use the **Edit Cloudflare Workers** template or create a custom token with these permissions:
   - Account - Cloudflare Pages: Read
   - Account - Workers Scripts: Read
   - Zone - Analytics: Read
   - Zone - DNS: Read (or Edit if you want to modify DNS)
5. Copy the token (you'll only see it once!)

#### 2. Set Environment Variable

Add your Cloudflare API token as an environment variable:

**On macOS/Linux:**
```bash
# Add to ~/.zshrc or ~/.bashrc
export CLOUDFLARE_API_TOKEN="your-api-token-here"

# Reload your shell
source ~/.zshrc  # or source ~/.bashrc
```

**On Windows (PowerShell):**
```powershell
# Set for current session
$env:CLOUDFLARE_API_TOKEN="your-api-token-here"

# Set permanently (requires administrator)
[System.Environment]::SetEnvironmentVariable('CLOUDFLARE_API_TOKEN', 'your-api-token-here', 'User')
```

#### 3. Restart Claude Code

After setting the environment variable, restart Claude Code for the changes to take effect.

### Usage

Once configured, Claude Code can:

- **Deploy to Cloudflare Pages**: "Deploy the latest build to Cloudflare Pages"
- **Check Analytics**: "Show me the analytics for the past week"
- **Manage Workers**: "List all my Workers"
- **Update DNS**: "Show me the DNS records for my domain"

### Security Notes

- **Never commit your API token** to version control
- The `CLOUDFLARE_API_TOKEN` should only be set as an environment variable
- Keep your API token secure and rotate it regularly
- Use minimal permissions needed (principle of least privilege)
- The `.claude/mcp.json` file is safe to commit (it doesn't contain secrets)

### Troubleshooting

**MCP servers not working:**
1. Verify your API token is set: `echo $CLOUDFLARE_API_TOKEN`
2. Check token permissions in Cloudflare Dashboard
3. Restart Claude Code
4. Check Claude Code logs for error messages

**Connection errors:**
- Ensure you have internet connectivity
- Verify the MCP server URLs are accessible
- Check for firewall or proxy issues

### Additional MCP Servers

Want to add more Cloudflare MCP servers? Available servers include:

- `https://d1.mcp.cloudflare.com/mcp` - D1 Database
- `https://r2.mcp.cloudflare.com/mcp` - R2 Storage
- `https://kv.mcp.cloudflare.com/mcp` - KV Storage
- `https://queues.mcp.cloudflare.com/mcp` - Queues
- `https://durable-objects.mcp.cloudflare.com/mcp` - Durable Objects
- `https://vectorize.mcp.cloudflare.com/mcp` - Vectorize
- `https://hyperdrive.mcp.cloudflare.com/mcp` - Hyperdrive
- `https://stream.mcp.cloudflare.com/mcp` - Stream
- `https://images.mcp.cloudflare.com/mcp` - Images

Add them to `mcp.json` following the same pattern.

## Resources

- [Cloudflare MCP Documentation](https://developers.cloudflare.com/agents/model-context-protocol/)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
