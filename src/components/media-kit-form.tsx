"use client";

import type { Dispatch } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MediaKitAction } from "@/lib/media-kit-reducer";
import type { MediaKit } from "@/lib/media-kit-types";
import { parseNumberInput } from "@/lib/media-kit-utils";

interface MediaKitFormProps {
  kit: MediaKit;
  dispatch: Dispatch<MediaKitAction>;
}

export function MediaKitForm({ kit, dispatch }: MediaKitFormProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Who you are</CardTitle>
          <CardDescription>Shown at the top of your media kit.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="creator-name">Name</Label>
            <Input
              id="creator-name"
              value={kit.creatorName}
              placeholder="Alex Rivera"
              onChange={(event) => dispatch({ type: "SET_FIELD", field: "creatorName", value: event.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={kit.tagline}
              placeholder="Tech reviews for indie hackers"
              onChange={(event) => dispatch({ type: "SET_FIELD", field: "tagline", value: event.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="niche">Niche</Label>
              <Input
                id="niche"
                value={kit.niche}
                placeholder="Tech / SaaS"
                onChange={(event) => dispatch({ type: "SET_FIELD", field: "niche", value: event.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={kit.location}
                placeholder="Austin, TX"
                onChange={(event) => dispatch({ type: "SET_FIELD", field: "location", value: event.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Contact email</Label>
            <Input
              id="email"
              type="email"
              value={kit.email}
              placeholder="alex@example.com"
              onChange={(event) => dispatch({ type: "SET_FIELD", field: "email", value: event.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={kit.bio}
              placeholder="A couple sentences on what you make and who watches/reads/listens."
              rows={4}
              onChange={(event) => dispatch({ type: "SET_FIELD", field: "bio", value: event.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Platforms</CardTitle>
          <CardDescription>Where your audience is, and how big.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {kit.platforms.map((platform) => (
            <div
              key={platform.id}
              className="grid grid-cols-1 gap-3 rounded-[var(--radius-sm)] border border-border p-3 sm:grid-cols-12 sm:items-end sm:gap-2"
            >
              <div className="space-y-1.5 sm:col-span-3">
                <Label htmlFor={`platform-name-${platform.id}`} className="sm:sr-only">
                  Platform
                </Label>
                <Input
                  id={`platform-name-${platform.id}`}
                  value={platform.platform}
                  placeholder="Instagram"
                  onChange={(event) =>
                    dispatch({ type: "SET_PLATFORM_FIELD", id: platform.id, field: "platform", value: event.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5 sm:col-span-3">
                <Label htmlFor={`platform-handle-${platform.id}`} className="sm:sr-only">
                  Handle
                </Label>
                <Input
                  id={`platform-handle-${platform.id}`}
                  value={platform.handle}
                  placeholder="@handle"
                  onChange={(event) =>
                    dispatch({ type: "SET_PLATFORM_FIELD", id: platform.id, field: "handle", value: event.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5 sm:col-span-3">
                <Label htmlFor={`platform-followers-${platform.id}`} className="sm:sr-only">
                  Followers
                </Label>
                <Input
                  id={`platform-followers-${platform.id}`}
                  type="number"
                  inputMode="numeric"
                  className="font-mono"
                  min={0}
                  step="1"
                  value={platform.followers}
                  placeholder="Followers"
                  onChange={(event) =>
                    dispatch({ type: "SET_PLATFORM_FOLLOWERS", id: platform.id, value: parseNumberInput(event.target.value) })
                  }
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor={`platform-engagement-${platform.id}`} className="sm:sr-only">
                  Engagement %
                </Label>
                <Input
                  id={`platform-engagement-${platform.id}`}
                  type="number"
                  inputMode="decimal"
                  className="font-mono"
                  min={0}
                  step="any"
                  value={platform.engagementRate}
                  placeholder="Eng. %"
                  onChange={(event) =>
                    dispatch({ type: "SET_PLATFORM_FIELD", id: platform.id, field: "engagementRate", value: event.target.value })
                  }
                />
              </div>
              <div className="flex justify-end sm:col-span-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-lg"
                  aria-label="Remove platform"
                  onClick={() => dispatch({ type: "REMOVE_PLATFORM", id: platform.id })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" size="lg" onClick={() => dispatch({ type: "ADD_PLATFORM" })}>
            <Plus className="mr-2 h-4 w-4" />
            Add platform
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Past brand collabs</CardTitle>
          <CardDescription>Optional — social proof for brands sizing you up.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {kit.pastCollabs.map((collab) => (
            <div
              key={collab.id}
              className="grid grid-cols-1 gap-3 rounded-[var(--radius-sm)] border border-border p-3 sm:grid-cols-12 sm:items-end sm:gap-2"
            >
              <div className="space-y-1.5 sm:col-span-3">
                <Label htmlFor={`collab-brand-${collab.id}`} className="sm:sr-only">
                  Brand
                </Label>
                <Input
                  id={`collab-brand-${collab.id}`}
                  value={collab.brand}
                  placeholder="Brand name"
                  onChange={(event) =>
                    dispatch({ type: "SET_COLLAB_FIELD", id: collab.id, field: "brand", value: event.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5 sm:col-span-8">
                <Label htmlFor={`collab-description-${collab.id}`} className="sm:sr-only">
                  Description
                </Label>
                <Input
                  id={`collab-description-${collab.id}`}
                  value={collab.description}
                  placeholder="Sponsored post, 40K views"
                  onChange={(event) =>
                    dispatch({ type: "SET_COLLAB_FIELD", id: collab.id, field: "description", value: event.target.value })
                  }
                />
              </div>
              <div className="flex justify-end sm:col-span-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-lg"
                  aria-label="Remove collab"
                  onClick={() => dispatch({ type: "REMOVE_COLLAB", id: collab.id })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" size="lg" onClick={() => dispatch({ type: "ADD_COLLAB" })}>
            <Plus className="mr-2 h-4 w-4" />
            Add collab
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rates</CardTitle>
          <CardDescription>Optional — leave blank to say "on request" instead.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <Label htmlFor="rate-note">Rate note</Label>
            <Textarea
              id="rate-note"
              value={kit.rateNote}
              placeholder="Feed post: $450 · Story: $150 · Bundle discounts available."
              rows={3}
              onChange={(event) => dispatch({ type: "SET_FIELD", field: "rateNote", value: event.target.value })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
