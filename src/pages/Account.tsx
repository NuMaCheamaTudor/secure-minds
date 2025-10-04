import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Account() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4">
      <div className="w-full max-w-xl animate-fade-in">
        <h1 className="text-3xl font-bold mb-4 text-center">Account Customization</h1>
        <Card className="p-6 mb-6">
          <p className="mb-4">Here you can customize your patient account details.</p>
          {/* Example fields, replace with real customization options */}
          <form className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input type="text" className="w-full border rounded px-3 py-2" placeholder="Your name" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input type="email" className="w-full border rounded px-3 py-2" placeholder="Your email" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Phone</label>
              <input type="tel" className="w-full border rounded px-3 py-2" placeholder="Your phone number" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Medical Notes</label>
              <textarea className="w-full border rounded px-3 py-2" placeholder="Add any relevant medical notes" />
            </div>
            <Button type="submit" className="w-full">Save Changes</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
