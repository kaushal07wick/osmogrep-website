import type { IconType } from 'react-icons';
import { LuBookOpen, LuBug, LuCode, LuFileCheck, LuFlaskConical, LuGitBranch, LuKeyboard, LuLayers, LuMessageSquare, LuSettings, LuShieldCheck, LuTerminal, LuUsers, LuWrench } from 'react-icons/lu';
import { SiGithub } from 'react-icons/si';

export const docIcons: Record<string, IconType> = {
  '': LuBookOpen, console: LuLayers, github: SiGithub, 'bug-catching': LuBug,
  findings: LuMessageSquare, runtime: LuFlaskConical, evidence: LuFileCheck,
  memory: LuMessageSquare, teams: LuUsers, cli: LuTerminal,
  'coding-agents': LuKeyboard, examples: LuCode, configuration: LuSettings,
  api: LuCode, security: LuShieldCheck, troubleshooting: LuWrench, architecture: LuGitBranch,
};
