import Link from "next/link";

export const collaborationGuides: Record<string, React.ReactNode> = {
  memory: <>
    <section id="connect-a-workspace"><h2>Connect a chat workspace.</h2>
      <div className="docs-provider-row"><span><img src="/brand/slack.svg" width="25" height="25" alt=""/>Slack</span><span><img src="/brand/discord.svg" width="25" height="25" alt=""/>Discord</span></div>
      <p>Memory brings selected channel conversations into reviews of their mapped repository. Direct messages are excluded.</p>
      <ol className="docs-steps"><li><strong>Choose your OsmoGrep workspace.</strong><p>For a company connection, switch to its team workspace first. You need the Owner or Admin role to manage integrations.</p></li><li><strong>Open Memory and choose a provider.</strong><p>Select <strong>Connect Slack</strong>, or the corresponding action for another enabled provider. Approve access in the provider’s authorization screen.</p></li><li><strong>Confirm the connection.</strong><p>The Memory page shows the connected workspace or server, connection date and selected-channel count.</p></li></ol>
      <p>Slack app approval follows your organization’s <a href="https://slack.com/help/articles/222386767-Manage-app-approval-for-your-workspace" target="_blank" rel="noreferrer">app policy</a>. OsmoGrep’s Discord connection requires a server owner or administrator and is available when enabled on the Memory page.</p>
      <a className="docs-text-link" href="https://app.osmogrep.com/dashboard/memory">Open Memory ↗</a>
    </section>
    <section id="choose-channels"><h2>Choose channels and a repository.</h2>
      <ol className="docs-steps"><li><strong>Make the channel available.</strong><p>In Slack, invite the OsmoGrep app to the channel. For Discord, the app must be able to read the selected server channel.</p></li><li><strong>Add the channel.</strong><p>Choose a channel and one of your workspace’s connected repositories, then select <strong>Add channel</strong>.</p></li><li><strong>Sync recent messages.</strong><p>Select <strong>Sync</strong> beside the channel. Source messages show imported excerpts, authors, timestamps and links to the original conversation.</p></li></ol>
      <p>Slack manual sync reads up to 15 recent messages per request with a one-minute workspace cooldown. Discord manual sync reads up to 50. Provider rate limits can delay another sync.</p>
    </section>
    <section id="memory-in-reviews"><h2>How reviews use memory.</h2>
      <p>After a channel is selected and mapped, console source reviews and repair requests can retrieve relevant excerpts for that repository. The report lists the channel sources that informed it.</p>
      <p>Reviews using workspace memory remain private in the console. GitHub receives a link to the private review rather than its findings or patch. Channel messages provide context; source code and execution evidence determine the result.</p>
      <p>Use the connection selector to switch between linked workspaces or servers. <strong>Add Slack workspace</strong> or the corresponding provider action connects another account without replacing the existing connection.</p>
    </section>
    <section id="manage-stored-memory"><h2>Inspect or remove stored memory.</h2>
      <p>Search Source messages or filter by channel to inspect what is available to reviews. Memory uses a 30-day message window.</p>
      <p>Removing a channel deletes its imported messages. <strong>Disconnect and delete memory</strong> removes that connection and its selected channels; other connections stay linked. Previously saved reviews and exports are separate records.</p>
      <Link className="docs-text-link" href="/docs/security">Security and data →</Link>
    </section>
  </>,
  teams: <>
    <section id="create-a-team"><h2>Create a team workspace.</h2>
      <ol className="docs-steps"><li><strong>Open Settings.</strong><p>Sign in with GitHub and go to <strong>Team access</strong>.</p></li><li><strong>Name the workspace.</strong><p>Enter a name under <strong>New team workspace</strong>, then select <strong>Create team workspace</strong>.</p></li><li><strong>Connect the team’s repositories.</strong><p>A new team starts empty. Connect its repositories and chat integrations inside that workspace.</p></li></ol>
      <p>The creator becomes Owner. Your personal repositories, reviews and connections remain in your personal workspace. Use the workspace picker above the dashboard navigation to switch between them.</p>
      <a className="docs-text-link" href="https://app.osmogrep.com/dashboard/settings">Open team settings ↗</a>
    </section>
    <section id="invite-teammates"><h2>Invite a teammate.</h2>
      <ol className="docs-steps"><li><strong>Enter their GitHub username.</strong><p>In the team’s <strong>Settings → Team access</strong>, choose a role and select <strong>Invite teammate</strong>.</p></li><li><strong>Share the Settings link.</strong><p>Ask them to sign in at <a href="https://app.osmogrep.com/dashboard/settings">app.osmogrep.com/dashboard/settings</a> using the invited GitHub account.</p></li><li><strong>Accept the invitation.</strong><p>They select <strong>Accept invitation</strong> under <strong>Your invitations</strong>. The team then appears in their workspace picker.</p></li></ol>
      <p>Invitations expire after seven days. Only the invited GitHub account can accept. Revoke an unused invitation from Team access or invite the person again after it expires.</p>
    </section>
    <section id="workspace-roles"><h2>Workspace roles.</h2>
      <div className="docs-table-wrap" tabIndex={0} role="region" aria-label="Reference table"><table><thead><tr><th>Action</th><th>Member</th><th>Admin</th><th>Owner</th></tr></thead><tbody><tr><td>Read shared reviews and selected channel memory</td><td>Yes</td><td>Yes</td><td>Yes</td></tr><tr><td>Request reviews for connected repositories</td><td>Yes</td><td>Yes</td><td>Yes</td></tr><tr><td>Manage repositories and integrations</td><td>—</td><td>Yes</td><td>Yes</td></tr><tr><td>Invite or remove members</td><td>—</td><td>Yes</td><td>Yes</td></tr><tr><td>Appoint or manage admins</td><td>—</td><td>—</td><td>Yes</td></tr></tbody></table></div>
      <p>A team supports up to 100 members and active pending invitations combined. GitHub repository permissions still apply; joining a team does not add someone to your GitHub organization or Slack workspace.</p>
    </section>
    <section id="manage-team-access"><h2>Manage access.</h2>
      <p>Use <strong>Remove</strong> in Team access to revoke a member’s access. Owners can change Member and Admin roles; admins can manage members. The creator retains the Owner role.</p>
      <p>Connect company chat accounts from the team workspace so their selected-channel context is shared with that team.</p>
      <Link className="docs-text-link" href="/docs/memory">Connect channel memory →</Link>
    </section>
  </>,
};
