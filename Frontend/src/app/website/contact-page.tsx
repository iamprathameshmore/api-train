import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, GithubIcon, Linkedin, MessageCircle } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="max-w-3xl mx-auto py-12 px-4 space-y-6">
            <h1 className="text-3xl font-bold">📬 Contact APItrain</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Get in Touch</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Have questions, feedback, or ideas? We're here to help. Reach out anytime.
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Email</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Send us an email and we’ll respond within 24 hours.
                    </p>
                    <a href="mailto:hello@apitrain.com">
                        <Button variant="outline" className="mt-4">
                            <Mail className="mr-2" /> hello@apitrain.com
                        </Button>
                    </a>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Social Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">Connect with the creator:</p>

                    <div className="flex gap-4">
                        <a
                            href="https://github.com/prathameshmr"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="outline" size="sm">
                                <GithubIcon className="mr-2" /> GitHub
                            </Button>
                        </a>

                        <a
                            href="https://linkedin.com/in/prathameshmr"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="outline" size="sm">
                                <Linkedin className="mr-2" /> LinkedIn
                            </Button>
                        </a>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Community & Support</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Join our community discussions or ask questions.
                    </p>

                    <a
                        href="https://discord.gg/YOUR_DISCORD"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button variant="outline" size="sm" className="mt-4">
                            <MessageCircle className="mr-2" /> Join Discord
                        </Button>
                    </a>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Contribute</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Want to improve APItrain? Help us build the future of ML automation.
                    </p>
                    <a
                        href="https://github.com/yourusername/apitrain"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button className="mt-4">Contribute on GitHub</Button>
                    </a>
                </CardContent>
            </Card>
        </div>
    )
}
