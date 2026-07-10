'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Share2, Plus, Heart, Users } from 'lucide-react';

const photos = [
  { id: 1, title: "Midnight Neon", likes: "4.2K", date: "Jakarta • 12 Mei 2025", img: "https://picsum.photos/600/600?random=2" },
  { id: 2, title: "Rainy Reflections", likes: "3.8K", date: "Bandung • 8 Jun 2025", img: "https://picsum.photos/600/600?random=3" },
  { id: 3, title: "Golden Hour", likes: "5.1K", date: "Bali • 15 Jun 2025", img: "https://picsum.photos/600/600?random=4" },
  { id: 4, title: "City Pulse", likes: "2.9K", date: "Surabaya • 20 Jun 2025", img: "https://picsum.photos/600/600?random=5" },
  { id: 5, title: "Silent Streets", likes: "3.4K", date: "Yogyakarta • 25 Jun 2025", img: "https://picsum.photos/600/600?random=6" },
];

const albums = [
  { title: "Golden Hour Series", count: 42, img: "https://picsum.photos/600/400?random=7" },
  { title: "Urban Nights", count: 28, img: "https://picsum.photos/600/400?random=8" },
  { title: "Rain & Light", count: 35, img: "https://picsum.photos/600/400?random=9" },
];

export default function PhotoGallery() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <nav className="border-b border-zinc-800 bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl">📸</div>
            <h1 className="text-2xl font-bold">GaleriKu</h1>
          </div>

          <div className="flex-1 max-w-xl mx-8">
            <input
              type="text"
              placeholder="Cari foto atau album..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-full py-3 px-5 text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          <Button className="bg-white text-black hover:bg-orange-500 hover:text-white gap-2">
            <Plus className="w-4 h-4" /> Unggah Foto
          </Button>
        </div>
      </nav>

      <div className="relative h-[520px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://picsum.photos/1920/1080?random=10')" 
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        <div className="absolute inset-0 flex items-end pb-12 md:pb-16">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="flex flex-col md:flex-row gap-10 items-end">
              {/* Profile Photo */}
              <div className="relative -mb-6 md:-mb-8">
                <div className="w-56 h-56 md:w-64 md:h-64 rounded-3xl overflow-hidden ring-8 ring-white/20 shadow-2xl">
                  <img 
                    src="https://picsum.photos/600/600?random=1" 
                    alt="Photographer" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 text-sm">
                    Verified Artist
                  </Badge>
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Users className="w-5 h-5" />
                    <span>248.392 pengikut</span>
                  </div>
                </div>

                <h1 className="text-6xl md:text-7xl font-bold tracking-tighter">
                  Urban Nights
                </h1>
                <p className="text-2xl text-orange-300">Koleksi Fotografi oleh @nama_fotografer</p>

                <div className="flex flex-wrap gap-4 pt-6">
                  <Button size="lg" className="text-lg px-10 py-6 bg-white text-black hover:bg-white/90 rounded-full">
                    <Play className="mr-3 w-6 h-6" fill="black" /> Putar Slide Show
                  </Button>

                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white/30 hover:bg-white/10 rounded-full">
                    <Heart className="mr-3" /> Ikuti
                  </Button>

                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white/30 hover:bg-white/10 rounded-full">
                    <Share2 className="mr-3" /> Bagikan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold">Foto Populer</h2>
          <Button variant="link" className="text-orange-400">
            Lihat Semua →
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {photos.map((photo) => (
            <Card key={photo.id} className="bg-zinc-900 border-zinc-800 overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer group">
              <div className="relative">
                <img 
                  src={photo.img} 
                  alt={photo.title}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute bottom-3 right-3 bg-black/70 text-xs px-2.5 py-1 rounded flex items-center gap-1">
                  ❤️ {photo.likes}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold group-hover:text-orange-400 transition">{photo.title}</h3>
                <p className="text-zinc-400 text-sm mt-1">{photo.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-semibold mb-8">Album Lainnya</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {albums.map((album, i) => (
            <Card key={i} className="bg-zinc-900 border-zinc-800 overflow-hidden hover:scale-105 transition-all cursor-pointer">
              <img 
                src={album.img} 
                alt={album.title}
                className="w-full h-52 object-cover"
              />
              <CardContent className="p-5">
                <h3 className="font-semibold text-lg">{album.title}</h3>
                <p className="text-zinc-400 text-sm mt-1">{album.count} foto</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}