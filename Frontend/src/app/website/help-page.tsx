import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function HelpPage() {
  return (
    <div className=" bg-gradient-to-tr from-bg-pink-50 to-white">
      <div className="max-w-3xl mx-auto py-12 px-4">
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
            By default, models run locally via FastAPI. You can also deploy using Docker or on cloud providers like AWS, GCP, or Railway.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q4">
          <AccordionTrigger>Can I customize the model?</AccordionTrigger>
          <AccordionContent>
            Yes! If you're a developer, clone the repo and edit the training pipeline to suit your custom logic.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q5">
          <AccordionTrigger>Is my dataset stored securely?</AccordionTrigger>
          <AccordionContent>
            Your datasets are stored locally by default. If you're using a hosted version, make sure to enable encryption and access control.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-8 text-center">
        <p className="text-muted-foreground">
          Still need help?{" "}
          <a href="mailto:support@apitrain.dev" className="text-primary underline">
            Contact our support team
          </a>
        </p>
        <a
          href="https://github.com/yourusername/apitrain"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 underline mt-2 inline-block"
        >
          Visit Full Docs on GitHub →
        </a>
      </div>
    </div>
    </div>
  )
}
