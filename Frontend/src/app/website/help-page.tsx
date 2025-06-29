// src/app/website/help-page.tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HelpPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">❓ Help & FAQs</h1>

      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="q1">
          <AccordionTrigger>How do I upload a dataset?</AccordionTrigger>
          <AccordionContent>
            Go to the "Create API" section, upload your CSV file, and configure basic model settings. APItrain handles the training for you.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q2">
          <AccordionTrigger>What types of models are supported?</AccordionTrigger>
          <AccordionContent>
            Classification and regression models using AutoGluon. More ML tasks coming soon (e.g., NLP, image classification).
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q3">
          <AccordionTrigger>Where is my model hosted?</AccordionTrigger>
          <AccordionContent>
            By default, models run locally via FastAPI. You can also deploy using Docker or on a cloud provider like AWS, GCP, or Railway.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q4">
          <AccordionTrigger>Can I customize the model?</AccordionTrigger>
          <AccordionContent>
            Yes! If you're a developer, clone the repo and edit the training pipeline to suit your custom logic.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
