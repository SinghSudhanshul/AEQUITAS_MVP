# AEQUITAS LV-COP: FREE VS PREMIUM FEATURE MATRIX
## Commercial Strategy: Land with Free, Expand with Premium

**Version:** 1.0  
**Purpose:** Clear tier definition to avoid scope creep and align sales/engineering

---

## FREEMIUM PHILOSOPHY: GIVE AWAY THE MIRACLE, SELL THE IMPLEMENTATION

**Core Principle**: The forecasting algorithm (our "miracle") is available free. Premium charges for operational integration, real-time delivery, and human expertise.

**Why This Works**:
1. **Trust Building**: Free tier proves accuracy before asking for payment
2. **Viral Growth**: Analysts share tool with peers ("Check out this free crisis forecasting")
3. **Natural Upgrade Path**: Once relying on daily forecasts, teams pay for real-time and automation
4. **Defensible Moats**: Premium features (broker APIs, custom calibration) create switching costs

**Anti-Pattern to Avoid**: Crippling free tier so badly it's unusable. Free must deliver genuine value or it's just a trial in disguise.

---

## TIER COMPARISON TABLE

| Feature | Free | Premium | Enterprise |
|---------|------|---------|------------|
| **PRICE** | **$0/month** | **$30,000/month** | **Custom (typically $75K-$150K/month)** |
| **Target Customer** | Funds $500M-$1B AUM | Funds $1B-$10B AUM | Funds $10B+ AUM |
| | | | |
| **DATA INPUT** | | | |
| CSV Upload | ✅ Daily (1 file/day) | ✅ Unlimited | ✅ Unlimited |
| Manual Entry | ✅ Unlimited | ✅ Unlimited | ✅ Unlimited |
| Broker API Integration | ❌ | ✅ 3 brokers (GS, MS, JPM) | ✅ Unlimited brokers |
| Custom Data Formats | ❌ | ❌ | ✅ We adapt to your system |
| Historical Data Import | 30 days | 2 years | Unlimited |
| | | | |
| **FORECASTING** | | | |
| Daily Forecast | ✅ 1 per day, 9am EST | ✅ Unlimited requests | ✅ Unlimited |
| Intraday Forecasts | ❌ | ✅ Every 4 hours | ✅ Every 1 hour |
| Real-time Forecasts | ❌ | ❌ | ✅ On-demand via API |
| Forecast Horizon | Tomorrow only | 1-5 days ahead | 1-30 days ahead |
| Quantile Forecasts (P5, P50, P95) | ✅ | ✅ | ✅ |
| Regime Detection | ✅ | ✅ | ✅ |
| Crisis Model | ✅ | ✅ Enhanced | ✅ Custom-calibrated |
| Model Version | Standard | Standard | Client-specific |
| | | | |
| **ACCURACY & PERFORMANCE** | | | |
| Steady-State Accuracy Target | 85-88% | 88-90% | 90-92% |
| Crisis Accuracy Target | 80-83% | 83-85% | 85-88% |
| Custom Calibration | ❌ | ✅ 1 calibration session | ✅ Quarterly recalibration |
| Model Retraining Frequency | Monthly | Weekly | Real-time learning |
| | | | |
| **ANALYTICS & REPORTING** | | | |
| Forecast History | 30 days | 2 years | Unlimited |
| Accuracy Metrics | Basic | Advanced (by regime, broker, day-of-week) | Custom dashboards |
| Email Reports | ❌ | ✅ Weekly | ✅ Daily + custom |
| API Access | ❌ | ✅ 10,000 calls/day | ✅ Unlimited |
| Webhooks | ❌ | ✅ Forecast updates | ✅ Forecast + alerts |
| Data Export | CSV only | CSV + JSON + Excel | API + custom formats |
| | | | |
| **INTEGRATION & AUTOMATION** | | | |
| Broker Connectivity | Manual CSV | Automated via API | Automated + custom |
| Slack/Teams Notifications | ❌ | ✅ Daily digest | ✅ Real-time alerts |
| Treasury System Integration | ❌ | ❌ | ✅ Custom connectors |
| Bloomberg Terminal Plugin | ❌ | ❌ | ✅ (roadmap) |
| | | | |
| **SUPPORT & SLA** | | | |
| Support Channel | Community forum | Email (24h response) | Dedicated Slack channel |
| Implementation Help | Self-service | 2-week guided onboarding | White-glove (4-8 weeks) |
| Model Troubleshooting | ❌ | ✅ Email support | ✅ Direct ML team access |
| SLA Guarantee | None | 99.5% uptime | 99.9% uptime + financial penalties |
| Account Manager | ❌ | ❌ | ✅ Dedicated CSM |
| | | | |
| **COMPLIANCE & SECURITY** | | | |
| Audit Logging | ❌ | ✅ 7-year retention | ✅ + tamper-proof signatures |
| Data Encryption | In transit only | In transit + at rest | + field-level encryption |
| SOC 2 Compliance | N/A | ✅ Type II | ✅ Type II + custom audits |
| Regulatory Reporting Templates | ❌ | ✅ BCBS 225, CSDR | ✅ + custom reports |
| Data Residency Options | US only | US + EU | US + EU + custom |
| | | | |
| **ADVANCED FEATURES** | | | |
| Stress Testing Module | ❌ | ❌ | ✅ Custom scenarios |
| Scenario Analysis | ❌ | ✅ 3 pre-built scenarios | ✅ Unlimited custom |
| Collateral Optimization | ❌ | ❌ | ✅ (Q3 2026 roadmap) |
| Multi-Currency Support | USD only | USD + EUR + GBP | ✅ All major currencies |
| White-Label Option | ❌ | ❌ | ✅ ($50K setup fee) |

---

## PRICING JUSTIFICATION

### Free Tier Economics

**Cost to Serve (per user per month):**
- Cloud infrastructure (Railway): $0.50
- Database storage: $0.20
- API bandwidth: $0.10
- Support (amortized): $0.50
- **Total:** $1.30/user/month

**Why We Can Afford Free:**
- Target 1,000 free users = $1,300/month cost
- 10% conversion to Premium = 100 users × $30K = $3M ARR
- Free tier is customer acquisition cost (CAC), not a product

**Usage Limits (Prevent Abuse):**
- 1 CSV upload per day (10 forecasts/day would cost us $5/month in compute)
- 100 API calls per day (prevents reselling our API)
- 30-day data retention (reduces storage costs)

### Premium Tier Pricing ($30,000/month = $360,000/year)

**Value Delivered:**
- Average fund has $5B in positions
- 1% improvement in collateral efficiency = $50M deployed at 5.33% = $2.7M annual interest income
- Even 10% of that = $270K value, making $360K price seem fair
- **Value Ratio: 0.75x** (reasonable for B2B SaaS)

**Cost to Serve:**
- Broker API fees: $500/month (amortized across clients)
- Custom calibration: $5K one-time (20 hours × $250/hour)
- Dedicated support: $1K/month (10% of CSM time)
- Infrastructure: $50/month (higher API usage)
- **Total:** $1,550/month + $5K setup = **~$6,600 first year**

**Gross Margin:** ($360K - $6,600) / $360K = **98%** (typical SaaS)

### Enterprise Tier Pricing (Starting at $75,000/month = $900,000/year)

**When to Offer Enterprise:**
- Client has $10B+ AUM (can justify higher price)
- Needs >3 broker integrations
- Requires custom data formats or legacy system integration
- Wants dedicated account manager and <1 hour support response

**Cost to Serve:**
- Custom development: $50K one-time (200 hours × $250/hour)
- Dedicated infrastructure: $500/month (separate deployment for compliance)
- Dedicated CSM: $10K/month (full-time account manager)
- Quarterly calibration: $5K/quarter (20 hours × $250/hour)
- **Total:** $50K setup + $132K/year ongoing = **~$182K first year**

**Gross Margin:** ($900K - $182K) / $900K = **80%** (still excellent)

---

## CONVERSION FUNNEL ASSUMPTIONS

### Stage 1: Free Tier Adoption (Month 1-3)
- **Target:** 100 free signups in first 3 months
- **Sources:** Product Hunt launch, LinkedIn posts, hedge fund analyst networks
- **Activation:** 30% upload CSV and get first forecast (30 active users)

### Stage 2: Premium Trials (Month 3-6)
- **Qualified Leads:** 30% of active free users express interest (9 leads)
- **Trial Close Rate:** 33% convert to paid pilot (3 paid pilots × $30K)
- **ARR Booked:** $1.08M (3 clients × $360K)

### Stage 3: Expansion (Month 6-12)
- **Free → Premium:** 5% annual conversion rate (assume 500 free users by month 12 → 25 Premium)
- **Premium Retention:** 90% annual retention
- **Year 1 ARR:** 25 Premium × $360K = $9M ARR (optimistic, plan for $3-5M realistically)

### Stage 4: Enterprise Upsell (Month 12-24)
- **Premium → Enterprise:** 20% of Premium clients (5 clients)
- **New Enterprise Direct Sales:** 3 clients (outbound to top 20 hedge funds)
- **Year 2 ARR:** 20 Premium × $360K + 8 Enterprise × $900K = $14.4M ARR

---

## FEATURE DEVELOPMENT PRIORITY

### Must-Have for Launch (Week 1-8)
1. ✅ Free tier: CSV upload
2. ✅ Free tier: Daily forecast generation
3. ✅ Free tier: 30-day history
4. ✅ Premium tier: Broker API (at least 1 broker - Goldman Sachs)
5. ✅ Premium tier: Intraday forecasts (every 4 hours)

### Nice-to-Have for PMF (Week 9-16)
6. Premium tier: Email reports
7. Premium tier: Slack notifications
8. Premium tier: Custom calibration workflow
9. All tiers: Improved accuracy (88% → 90%)
10. All tiers: Regime detection refinement

### Enterprise Features (Quarter 2)
11. Enterprise tier: Real-time forecasts (on-demand)
12. Enterprise tier: Custom data format ingestion
13. Enterprise tier: White-label branding
14. Enterprise tier: Dedicated infrastructure

### Future Roadmap (Quarter 3-4)
15. Stress testing module (Enterprise)
16. Collateral optimization (Enterprise)
17. Bloomberg Terminal plugin (Enterprise)
18. Mobile app (all tiers)

---

## COMPETITIVE DIFFERENTIATION BY TIER

### vs Bloomberg (Primary Competitor)

| Feature | Bloomberg Liquidity Analytics | Aequitas Free | Aequitas Premium |
|---------|------------------------------|---------------|------------------|
| Price | $2,000/user/month | $0 | $30,000/firm/month |
| Crisis Accuracy | ~30% (March 2020) | 80-83% | 83-85% |
| Setup Time | 6 months | 10 minutes | 2 weeks |
| Regime Detection | ❌ | ✅ | ✅ |
| Custom Calibration | ❌ (one size fits all) | ❌ | ✅ |
| Broker Integration | Manual | Manual | Automated |

**Our Advantage**: We're 40x cheaper (Premium vs Bloomberg for 15-user team), 10x faster to deploy, and 2.5x more accurate during crises. Bloomberg's only advantage is brand recognition.

### vs In-House Models (Secondary Competitor)

Most $5B+ funds have quant teams building internal liquidity models. Why switch to us?

**Our Pitch:**
- "Your quant team is brilliant, but are they forecasting experts? We have PhD economists who only do this."
- "Your model probably broke in March 2020 like everyone else's. Ours didn't."
- "Free tier costs you zero. Try it. If it beats your model, upgrade. If not, keep using yours."

---

## UPGRADE TRIGGERS (Free → Premium)

**Behavioral Signals** (automated):
1. User logs in 20+ days in a row (daily dependency)
2. User views forecast before 9am 5 days in a row (wants earlier access)
3. User clicks "Download CSV" 10+ times (wants API integration)
4. User's fund is >$1B AUM (can afford Premium)

**In-App Prompt**:
```
You've used Aequitas every day for 3 weeks! 🎉

Want to save 4 hours per week? Upgrade to Premium for:
• Real-time broker syncs (no more CSV uploads)
• Intraday updates (forecasts every 4 hours, not just 9am)
• Custom calibration (90% accuracy vs current 88%)

[Book Demo] [Remind Me Later]
```

**Email Nurture Sequence**:
- Day 7: "How accurate is Aequitas vs your current process?"
- Day 14: Case study from pilot client
- Day 21: Upgrade offer with 20% discount
- Day 30: Final offer: "Last chance for early adopter pricing"

---

## CHURN PREVENTION

### Free Tier Churn (Acceptable Rate: 80% after 90 days)
**Why High Churn is OK:**
- Free tier is top-of-funnel, meant to filter for qualified leads
- Only want users who actively engage, not dormant accounts

**Retention Tactics:**
- Weekly email: "Your forecast for Monday is $X.XM (view details)"
- Monthly comparison: "Your forecast accuracy improved 5% this month"
- Gamification: "You're in the top 10% of power users"

### Premium Churn (Target: <5% annually)
**Red Flags:**
- No CSV upload in 7 days
- No forecast views in 3 days
- Accuracy below 80% for 2 consecutive weeks
- Support tickets not resolved within 24 hours

**Intervention:**
- Immediate outreach from CSM
- Emergency calibration session (free)
- Pause billing until issue resolved (show good faith)

---

## PRICING EXPERIMENTS TO RUN (Month 6+)

**Test 1: Annual Pre-Pay Discount**
- Current: $30K/month × 12 = $360K
- Experiment: $300K if paid annually ($60K discount)
- **Hypothesis**: Improves cash flow, reduces churn (sunk cost)

**Test 2: Usage-Based Pricing (Alternative to Flat Fee)**
- Tier 1: $10K/month + $50 per forecast generated
- Tier 2: $20K/month + $25 per forecast
- Tier 3: $30K/month unlimited
- **Hypothesis**: Lowers barrier for small funds, increases ARPU for large funds

**Test 3: Freemium → Trial**
- Replace free tier with 30-day free trial of Premium
- After 30 days: Pay $30K or downgrade to free tier
- **Hypothesis**: Higher conversion (40% vs 10%) but lower funnel volume

---

## SALES ENABLEMENT

### Discovery Questions (Qualify for Premium)

**Budget:**
- "What's your annual treasury technology budget?" (Need >$300K)
- "Who approves software purchases over $50K?" (Get to decision-maker)

**Pain:**
- "What happened to your liquidity forecasts in March 2020?" (Trigger memory of pain)
- "How many hours per week do your analysts spend on liquidity planning?" (Quantify time savings)

**Authority:**
- "Are you the final decision-maker or do others need to approve?" (Avoid wasting time on non-buyers)

**Timing:**
- "When does your treasury team do annual planning?" (Q4 typically)
- "Any upcoming regulatory audits that require better liquidity monitoring?" (BCBS 225 deadline)

### Objection Handling

**"We already have Bloomberg."**
→ "Bloomberg is great for market data. Aequitas is specialized for crisis forecasting. Can we run a 30-day comparison? If we're not more accurate, you lose nothing."

**"We built an in-house model."**
→ "That's impressive! How did it perform in March 2020? Our model maintained 85% accuracy while most internal models dropped to 30-40%. Worth a free trial?"

**"$30K/month is too expensive."**
→ "Understood. What's the cost of a single settlement fail? (CSDR penalty: ~$15K average). Our clients avoid 2-3 fails per year, so we pay for ourselves."

**"We need to see it work first."**
→ "Exactly why we have a free tier. Start there, upload your CSV, get forecasts for 30 days. Zero commitment. When you're convinced, we can discuss Premium."

---

## ANTI-PATTERNS TO AVOID

❌ **Don't**: Make free tier so limited it's unusable (e.g., only 3 forecasts per month)
✅ **Do**: Make free tier genuinely useful but operationally inconvenient (CSV upload is manual burden)

❌ **Don't**: Offer Premium trial without qualifying (wastes implementation resources on non-buyers)
✅ **Do**: Require discovery call before Premium trial (qualify AUM, budget, authority, timeline)

❌ **Don't**: Negotiate price down to close deals (trains market that price is flexible)
✅ **Do**: Hold firm on price but offer payment flexibility (quarterly vs annual)

❌ **Don't**: Add Enterprise features to Premium just to close one deal (creates technical debt)
✅ **Do**: Charge one-time custom dev fee ($50K) if client needs non-standard features

---

## SUCCESS METRICS BY TIER

### Free Tier KPIs
- **Activation Rate**: % of signups who upload CSV within 7 days (Target: 40%)
- **Weekly Active Users (WAU)**: % of users who view forecast weekly (Target: 60%)
- **Free → Premium Conversion**: % who upgrade within 90 days (Target: 10%)

### Premium Tier KPIs
- **Implementation Time**: Days from contract to first automated forecast (Target: <14 days)
- **Forecast Accuracy**: Weekly average accuracy (Target: >88% steady-state)
- **Feature Adoption**: % using broker API vs CSV upload (Target: >80% API)
- **Net Revenue Retention (NRR)**: Revenue from cohort vs previous year (Target: >100% from upsells)

### Enterprise Tier KPIs
- **Custom Development Completion**: % of projects delivered on time (Target: >90%)
- **SLA Compliance**: % of months meeting 99.9% uptime (Target: 100%)
- **Executive Satisfaction**: NPS from C-level sponsors (Target: >60)
- **Expansion Revenue**: Average account growth year-over-year (Target: +25%)

---

## FINAL DECISION FRAMEWORK

**When to Keep Free**: If client can't pay or isn't qualified (< $500M AUM)  
**When to Upgrade to Premium**: If client is qualified ($1B+ AUM) and showing engagement (daily usage)  
**When to Offer Enterprise**: If client is large ($10B+ AUM), needs custom features, and willing to pay $75K+/month

**Remember**: Our business model is "land with free, expand with premium." Don't try to monetize too early. Prove value first.
