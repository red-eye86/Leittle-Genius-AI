import { NextRequest, NextResponse } from 'next/server';
import { getParentSettings, updateParentSettings } from '@/lib/db/store';

export async function GET() {
  const settings = getParentSettings();
  // Mask API keys for safe response
  const safeSettings = {
    ...settings,
    geminiApiKey: settings.geminiApiKey ? '••••••••' + settings.geminiApiKey.slice(-4) : '',
    openAiApiKey: settings.openAiApiKey ? '••••••••' + settings.openAiApiKey.slice(-4) : '',
    anthropicApiKey: settings.anthropicApiKey ? '••••••••' + settings.anthropicApiKey.slice(-4) : '',
  };
  return NextResponse.json({ settings: safeSettings });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const current = getParentSettings();

    // Verify PIN if verifying or updating sensitive items
    if (body.verifyPin) {
      const isValid = body.verifyPin === current.pin;
      return NextResponse.json({ valid: isValid });
    }

    // Check if new API keys were submitted
    const updates: any = { ...body };
    if (body.geminiApiKey?.startsWith('••••')) delete updates.geminiApiKey;
    if (body.openAiApiKey?.startsWith('••••')) delete updates.openAiApiKey;
    if (body.anthropicApiKey?.startsWith('••••')) delete updates.anthropicApiKey;

    const updated = updateParentSettings(updates);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

