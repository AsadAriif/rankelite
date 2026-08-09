import re
import os

print("Injecting Bugatti 3-Card Carousel into index.html...")

index_path = r"e:\100online\index.html"
with open(index_path, "r", encoding="utf-8") as f:
    html = f.read()

# 1. Update view mode buttons in header
old_buttons = """        <div class="flex items-center bg-[#F5F3FF] p-1 rounded-xl border border-purple-200">
          <button onclick="setViewMode('grid')" id="view-grid-btn" class="p-2 rounded-lg text-[#7C3AED] bg-white shadow-sm"><i data-lucide="grid" class="w-4 h-4"></i></button>
          <button onclick="setViewMode('list')" id="view-list-btn" class="p-2 rounded-lg text-gray-400 hover:text-black"><i data-lucide="list" class="w-4 h-4"></i></button>
        </div>"""

new_buttons = """        <div class="flex items-center bg-[#F5F3FF] p-1 rounded-xl border border-purple-200 shadow-sm">
          <button onclick="setViewMode('bugatti')" id="view-bugatti-btn" class="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 text-white bg-[#7C3AED] shadow-sm transition-all" title="Bugatti 3-Card Carousel">
            <i data-lucide="sliders-horizontal" class="w-3.5 h-3.5"></i>
            <span class="hidden sm:inline">3-Card Carousel</span>
          </button>
          <button onclick="setViewMode('grid')" id="view-grid-btn" class="p-2 rounded-lg text-gray-500 hover:text-black transition-all" title="Grid Layout"><i data-lucide="grid" class="w-4 h-4"></i></button>
          <button onclick="setViewMode('list')" id="view-list-btn" class="p-2 rounded-lg text-gray-500 hover:text-black transition-all" title="List Layout"><i data-lucide="list" class="w-4 h-4"></i></button>
        </div>"""

if old_buttons in html:
    html = html.replace(old_buttons, new_buttons)
    print("Updated view mode buttons in HTML.")

# 2. Update currentViewMode variable default to 'bugatti'
html = html.replace("let currentViewMode = 'grid';", "let currentViewMode = 'bugatti';")

# 3. Update setViewMode and renderItemsGrid implementation
old_render_start = "      if (currentViewMode === 'grid') {"
old_render_end = "    function setViewMode(mode) {"

bugatti_render_code = """      if (currentViewMode === 'bugatti') {
        container.className = "col-span-full";
        container.innerHTML = `
          <div class="bugatti-showcase-wrapper relative py-4 select-none">
            
            <!-- Top Controls for Carousel -->
            <div class="flex items-center justify-between mb-6 px-1">
              <div>
                <span class="text-xs font-black uppercase tracking-widest text-[#059669] flex items-center space-x-1">
                  <i data-lucide="sparkles" class="w-3.5 h-3.5 text-[#7C3AED]"></i>
                  <span>BUGATTI-INSPIRED 3-ITEM HORIZONTAL SHOWCASE</span>
                </span>
                <p class="text-xs text-gray-500 font-medium mt-0.5">Showing 3 items on screen with smooth horizontal navigation</p>
              </div>

              <div class="flex items-center space-x-3">
                <span id="bugatti-counter" class="font-mono text-xs font-black text-[#7C3AED] bg-white px-3 py-1.5 rounded-xl border border-purple-200 shadow-sm">
                  01 / ${displayItems.length}
                </span>
                <button onclick="scrollBugatti('prev')" class="p-3 rounded-2xl bg-white hover:bg-[#F5F3FF] text-[#4C1D95] border border-purple-300 hover:scale-105 shadow-sm transition-all" title="Previous Item">
                  <i data-lucide="chevron-left" class="w-5 h-5"></i>
                </button>
                <button onclick="scrollBugatti('next')" class="p-3 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#059669] text-white border border-white hover:scale-105 shadow-sm transition-all" title="Next Item">
                  <i data-lucide="chevron-right" class="w-5 h-5"></i>
                </button>
              </div>
            </div>

            <!-- 3-Item Snap Scroll Container -->
            <div id="bugatti-track" onscroll="handleBugattiScroll()" class="flex space-x-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 pt-2 px-1 no-scrollbar" style="scrollbar-width: none; ms-overflow-style: none;">
              ${displayItems.map((item, idx) => {
                const isFav = userFavorites.includes(item.id);
                const isComp = compareItems.some(c => c.id === item.id);
                const rankStyle = item.rank === 1 ? 'bg-gradient-to-r from-[#A78BFA] via-[#7C3AED] to-[#059669] text-white font-black shadow-md border-white' : item.rank === 2 ? 'bg-gray-200 text-black font-black' : item.rank === 3 ? 'bg-emerald-600 text-white font-black' : 'bg-[#F5F3FF] text-[#4C1D95] border-purple-300 font-bold';

                return `
                  <div class="bugatti-card snap-start flex-none w-[88vw] sm:w-[46vw] lg:w-[calc((100%-48px)/3)] rounded-3xl border-2 border-purple-200 hover:border-[#7C3AED] transition-all duration-500 overflow-hidden flex flex-col justify-between group bg-white shadow-luxury-card hover:-translate-y-1">
                    <div class="relative h-64 overflow-hidden bg-gray-100">
                      <img src="${item.image_url}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700">
                      <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25"></div>
                      
                      <div class="absolute top-4 left-4 px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider ${rankStyle} flex items-center space-x-1.5 shadow-md border">
                        <i data-lucide="award" class="w-3.5 h-3.5"></i>
                        <span>RANK #${item.rank}</span>
                      </div>

                      <div class="absolute top-4 right-4 flex items-center space-x-2">
                        <button onclick="toggleItemCompare(${item.id})" class="p-2.5 rounded-full ${isComp ? 'bg-[#059669] text-white ring-2 ring-white' : 'bg-white/85 text-gray-800 hover:text-[#7C3AED]'} backdrop-blur-md transition-all shadow-md" title="Side-by-side comparison">
                          <i data-lucide="split" class="w-4 h-4"></i>
                        </button>
                        <button onclick="toggleItemFav(${item.id})" class="p-2.5 rounded-full bg-white/85 text-gray-800 hover:text-red-500 backdrop-blur-md transition-all shadow-md" title="Save favorite">
                          <i data-lucide="heart" class="w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}"></i>
                        </button>
                      </div>

                      <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                        <span class="px-2.5 py-1 rounded-xl bg-black/75 text-[#DDD6FE] font-bold border border-white/20">${item.country || 'Global Standard'}</span>
                        <button onclick="openSubpropModalById(${item.id}, 'Verification Status', '100% Certified Official Record')" class="text-xs text-emerald-300 bg-black/75 px-2.5 py-1 rounded-xl border border-emerald-500/40 flex items-center space-x-1 font-bold hover:bg-emerald-950 transition-colors">
                          <i data-lucide="shield-check" class="w-3 h-3 text-emerald-400"></i>
                          <span>Verified</span>
                        </button>
                      </div>
                    </div>

                    <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 onclick="openItemModal(${item.id})" class="font-serif text-xl font-bold text-[#0A0A12] hover:text-[#7C3AED] cursor-pointer transition-colors mb-1 line-clamp-1">${item.title}</h3>
                        <p class="text-gray-600 text-xs sm:text-sm line-clamp-2 font-normal leading-relaxed">${item.description}</p>
                      </div>

                      <!-- Subproperty Specs Grid -->
                      <div class="grid grid-cols-2 gap-2 pt-3 border-t border-purple-100 text-xs">
                        ${Object.entries(item.specs).slice(0, 4).map(([k, v]) => `
                          <div onclick="openSubpropModalById(${item.id}, '${k}', '${v}')" class="bg-[#F5F3FF] hover:bg-[#EDE9FE] p-2.5 rounded-xl border border-purple-200 hover:border-[#7C3AED] cursor-pointer transition-all" title="Click to view verified official link">
                            <span class="block text-[9px] text-gray-500 uppercase tracking-wider font-bold truncate">${k}</span>
                            <span class="font-bold text-[#0A0A12] truncate block mt-0.5">${v}</span>
                          </div>
                        `).join('')}
                      </div>

                      <!-- Action Footer -->
                      <div class="pt-3 border-t border-purple-100 flex items-center justify-between gap-2">
                        <a href="${item.website}" target="_blank" rel="noopener noreferrer" class="flex-1 py-2 px-3 rounded-xl bg-[#ECFDF5] border border-emerald-300 text-[#064E3B] hover:bg-[#059669] hover:text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all shadow-sm">
                          <i data-lucide="globe" class="w-3.5 h-3.5"></i>
                          <span class="truncate">Main Website</span>
                          <i data-lucide="external-link" class="w-3 h-3 shrink-0"></i>
                        </a>

                        <button onclick="openItemModal(${item.id})" class="p-2 px-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7C3AED] font-bold text-xs flex items-center space-x-1 transition-colors border border-purple-200">
                          <span>Inspect</span>
                          <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Bottom Progress Track -->
            <div class="mt-4 px-1">
              <div class="w-full h-1.5 bg-purple-100 rounded-full overflow-hidden">
                <div id="bugatti-progress" class="h-full bg-gradient-to-r from-[#7C3AED] via-[#059669] to-[#D4AF37] transition-all duration-300 rounded-full" style="width: 10%;"></div>
              </div>
            </div>

          </div>
        `;
      } else if (currentViewMode === 'grid') {"""

html = html.replace("      if (currentViewMode === 'grid') {", bugatti_render_code)

# 4. Add helper functions for Bugatti scroll
new_helpers = """    function scrollBugatti(direction) {
      const track = document.getElementById('bugatti-track');
      if (!track) return;
      const card = track.querySelector('.bugatti-card');
      const cardWidth = card ? card.offsetWidth + 24 : 400;
      const scrollAmount = direction === 'next' ? cardWidth * 2 : -cardWidth * 2;
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }

    function handleBugattiScroll() {
      const track = document.getElementById('bugatti-track');
      if (!track) return;
      const card = track.querySelector('.bugatti-card');
      const cardWidth = card ? card.offsetWidth + 24 : 400;
      const index = Math.round(track.scrollLeft / cardWidth) + 1;
      const total = track.querySelectorAll('.bugatti-card').length;
      
      const counter = document.getElementById('bugatti-counter');
      if (counter) counter.innerText = `${String(Math.min(index, total)).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

      const progress = document.getElementById('bugatti-progress');
      if (progress && total > 0) {
        const pct = Math.min(100, Math.max(5, (index / total) * 100));
        progress.style.width = `${pct}%`;
      }
    }

    function setViewMode(mode) {
      currentViewMode = mode;
      const bugattiBtn = document.getElementById('view-bugatti-btn');
      const gridBtn = document.getElementById('view-grid-btn');
      const listBtn = document.getElementById('view-list-btn');

      if (bugattiBtn) bugattiBtn.className = mode === 'bugatti' ? 'px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 text-white bg-[#7C3AED] shadow-sm transition-all' : 'px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 text-gray-600 hover:text-black transition-all';
      if (gridBtn) gridBtn.className = mode === 'grid' ? 'p-2 rounded-lg text-[#7C3AED] bg-white shadow-sm transition-all' : 'p-2 rounded-lg text-gray-500 hover:text-black transition-all';
      if (listBtn) listBtn.className = mode === 'list' ? 'p-2 rounded-lg text-[#7C3AED] bg-white shadow-sm transition-all' : 'p-2 rounded-lg text-gray-500 hover:text-black transition-all';

      renderItemsGrid();
    }"""

old_set_view_mode = """    function setViewMode(mode) {
      currentViewMode = mode;
      document.getElementById('view-grid-btn').className = mode === 'grid' ? 'p-2 rounded-lg text-[#7C3AED] bg-white shadow-sm' : 'p-2 rounded-lg text-gray-400 hover:text-black';
      document.getElementById('view-list-btn').className = mode === 'list' ? 'p-2 rounded-lg text-[#7C3AED] bg-white shadow-sm' : 'p-2 rounded-lg text-gray-400 hover:text-black';
      renderItemsGrid();
    }"""

html = html.replace(old_set_view_mode, new_helpers)

with open(index_path, "w", encoding="utf-8") as f:
    f.write(html)

print("SUCCESS: index.html fully updated with Bugatti 3-card carousel!")
