const parseHTML = (htmlString) => {
    const parser = new DOMParser();
    return parser.parseFromString(htmlString.trim(), 'text/html').body.firstChild;
} 

export default ($renderTarget, currentPage, pagesCount, setPage) => {

    if(setPage === undefined) {
        setPage = (p) => {
            console.log('renderPagination(): Please add a setPage fn')
        };
    }

    let _setPage = (p) => {
        if(p >= 1 && p <= pagesCount && p !== currentPage) {
            setPage(p)
        }
    }

    let makeBaseHTMLNode = (id="") => {
        return parseHTML(`
            <nav id="`+id+`">
                <ul class="pagination justify-content-center" data-pagination-items>
                </ul>
            </nav>
        `)
    }

    let makePreviousLinkHTMLNode = (currentPage) => {
        return parseHTML(`
            <li class="page-item `+((currentPage == 1)?' disabled':'')+`" data-pagination-item>
                <a class="page-link" href="#" data-to-page="previous" data-pagination-item-link>
                    Previous
                </a>
            </li>
        `)
    }
    let makeNextLinkHTMLNode = (currentPage, pagesCount) => {
        return parseHTML(`
            <li class="page-item `+((currentPage >= pagesCount)?' disabled':'')+`" data-pagination-item>
                <a class="page-link" href="#" data-to-page="next" data-pagination-item-link>
                    Next
                </a>
            </li>
        `)
    }

    let makePageHTMLNode = (pageN, currentPage) => {
        return parseHTML(`
            <li class="page-item d-none d-md-block  `+((pageN==currentPage)?' active':'')+`" data-pagination-item>
                <a class="page-link" href="#" data-to-page="`+pageN+`" data-pagination-item-link>`+pageN+`</a>
            </li>
        `)
    }

    let makeEllipsisHTMLNode = () => {
        return parseHTML(`
            <li class="page-item d-none d-md-block  disabled">
                <a class="page-link disabled">
                    ...
                </a> 
            </li>
        `)
    }

    let makeTextHTMLNode = (text) => {
        return parseHTML(`
            <li class="page-item "><span>`+text+`</span> </li>
        `)
    }
        
    let $base = makeBaseHTMLNode();
    $renderTarget.appendChild($base);
    let $paginationItems = $base.querySelector('[data-pagination-items]');


    // Prev link
    let $paginationPrevious = makePreviousLinkHTMLNode(currentPage);
    $paginationItems.appendChild($paginationPrevious);
    let handlePreviousLinkClick = (e) => {
        e.preventDefault();
        _setPage(currentPage - 1);
    }
    let $paginationPreviousLink = $paginationPrevious.querySelector("[data-pagination-item-link]");
    $paginationPreviousLink.addEventListener("click", handlePreviousLinkClick);

    // Pages links
    let appendPage = (pageN) => {
        let itemHTMLNode = makePageHTMLNode(pageN, currentPage)
        $paginationItems.appendChild(itemHTMLNode);

        let handlePaginationItemLinkClick = (e) => {
            e.preventDefault();
            _setPage(pageN);
        }
        let $itemLink = itemHTMLNode.querySelector("[data-pagination-item-link]");
        $itemLink.addEventListener("click", handlePaginationItemLinkClick);
    }

    let appendEllipsis = () => {
        let $ellipsis = makeEllipsisHTMLNode()
        $paginationItems.appendChild($ellipsis);
    }

    let appendText = (text) => {
        let $text = makeTextHTMLNode(text);
        $paginationItems.appendChild($text);
    }

    if(pagesCount < 11) {

        for (let pageN=1; pageN<=pagesCount; pageN++) {
            appendPage(pageN);
        }

    } else {
    
        let offset = 2;
        let leftSize = currentPage-1;
        let rightSize = pagesCount-currentPage;

        if(leftSize >= offset+3) {
            appendPage(1);
            appendEllipsis();
            for (let i=offset; i>=1; i--) {
                appendPage(currentPage - i);
            }
        } else {
            for (let pageN=1; pageN<=leftSize; pageN++) {
                appendPage(pageN);
            }
        }

        appendPage(currentPage);
    
        if(rightSize >= offset+3) {
            for (let i=1; i<=offset; i++) {
                appendPage(currentPage + i);
            }
            appendEllipsis();
            appendPage(pagesCount);
        } else {
            for (let pageN=currentPage+1; pageN<=pagesCount; pageN++) {
                appendPage(pageN);
            }
        }

    }

    
    // Next link
    let $paginationNext = makeNextLinkHTMLNode(currentPage, pagesCount);
    $paginationItems.appendChild($paginationNext);
    let handleNextLinkClick = (e) => {
        e.preventDefault();
        _setPage(currentPage + 1);
    }
    let $paginationNextLink = $paginationNext.querySelector("[data-pagination-item-link]");
    $paginationNextLink.addEventListener("click", handleNextLinkClick);

}