export const runtime = 'nodejs';

const MSJ_CONTENT = `IN THE UNITED STATES DISTRICT COURT
FOR THE SOUTHERN DISTRICT OF NEW YORK

ACME CORP.,
    Plaintiff,
v.
BETA LLC,
    Defendant.

Case No. 1:24-cv-09876-JMF

PLAINTIFF ACME CORP.'S MEMORANDUM OF LAW IN SUPPORT OF
ITS MOTION FOR SUMMARY JUDGMENT ON LIABILITY

I. INTRODUCTION
This dispute arises out of Beta LLC's clear, unexcused breach of the Joint Venture Agreement signed on November 12, 2023. Under Section 8.4, the parties pledged absolute loyalty and commited to shared technology development. However, Defendant commingled ledgers and siphoned source code to its proprietary software suite.

II. ARGUMENT
A. Defendant Owed Plaintiff Fiduciary Duties under New York Law.
Under well-established New York law, a joint venture agreement creates fiduciary obligations between the co-venturers. See Meinhard v. Salmon, 249 N.Y. 458 (1928). In his landmark opinion, Chief Judge Cardozo noted that joint adventurers owe "the duty of the finest loyalty" and "a punctilio of an honor the most sensitive." Id. at 464.

[PENDING CITATION SLOT: Fiduciary duties survive the initial formal breakdown of the co-venturers' active project operations]

B. Defendant Breached Fiduciary Duties Through Commingling.
Defendant does not dispute it created a parallel ledger system. Commingling of joint venture assets is a per se breach of loyalty. See Henderson v. Continental Marine, 412 F.3d 891 (5th Cir. 2005).

[PENDING CITATION SLOT: Reverse-piercing corporate veil where subsidiary ledger accounts are fully commingled]`;

const MTD_CONTENT = `IN THE UNITED STATES DISTRICT COURT
FOR THE SOUTHERN DISTRICT OF NEW YORK

ACME CORP.,
    Plaintiff,
v.
BETA LLC,
    Defendant.

Case No. 1:24-cv-09876-JMF

DEFENDANT BETA LLC'S MEMORANDUM OF LAW IN SUPPORT OF ITS
MOTION TO DISMISS THE COMPLAINT UNDER RULE 12(B)(6)

I. INTRODUCTION
Plaintiff's Complaint fails to state a plausible claim for breach of fiduciary duty. Under New York law, simple arms-length commercial transactions do not elevate a contractual relationship into a joint venture or fiduciary partnership.

II. ARGUMENT
A. The Complaint Fails to Plead the Essential Elements of a Joint Venture.
To plead a joint venture under New York law, a plaintiff must allege mutual control, sharing of losses, and joint property. Plaintiff fails to allege any loss-sharing agreement.

[PENDING CITATION SLOT: Under New York pleading standards, absence of loss-sharing agreement fatal to joint venture claim]`;

const PRIV_CONTENT = `MEMORANDUM OF PRIVILEGED WORK PRODUCT

TO: Senior Litigation Committee
FROM: Lead Counsel, Lex8 Drafter
DATE: May 20, 2026
RE: Acme Corp. v. Beta LLC - Defensibility Analysis

SUMMARY
This memorandum outlines our litigation exposure and the risk of hallucinated authorities in current motions.`;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    // Choose text based on template requested
    let textToStream = MSJ_CONTENT;
    if (prompt === 'mtd') {
      textToStream = MTD_CONTENT;
    } else if (prompt === 'privileged_memo' || prompt === 'memo') {
      textToStream = PRIV_CONTENT;
    }

    // Split text into small chunks to simulate streaming
    const chunks = textToStream.split(/(\s+)/);

    const stream = new ReadableStream({
      async start(controller) {
        for (const chunk of chunks) {
          // AI SDK v4 expects the stream data protocol format: 0:"chunk text"\n
          controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(chunk)}\n`));
          // Small dynamic delay to mimic real LLM token streaming
          const delay = chunk.length > 5 ? 20 : 10;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'x-vercel-ai-data-stream': 'v1',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Streaming completion error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate completion' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
