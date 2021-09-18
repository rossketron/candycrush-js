export class DisjointSet {
    // Create a new Disjoint Set and init all property vals
    constructor(numElements) {
        if (numElements > 0) {

            this.size = numElements;
            this.links = [];
            this.ranks = [];
            this.sizes = [];
            this.elements = [];
            this.setIds = [];
            this.setIdIndices = [];

            this.links.fill(-1, 0, numElements - 1);
            this.ranks.fill(1, 0, numElements - 1);
            this.sizes.fill(1, 0, numElements - 1);
            this.elements.fill(-1, 0, numElements - 1);
            this.links.forEach(() => {
                this.setIds.push(i);
                this.setIdIndices.push(i);
                this.elements[i].push(i);
            })
        }
    }

    // Perform a union of two distinct sets
    Union = (set1, set2) => {
        let parent, child;
        let last;

        // verify valid params 
        if (this.links.length() == 0) {
            console.log("DisjointSet: Union called on an unitialized DisjointSet.");
            // continue;
        }
        if (set1 < 0 || set1 >= this.links.length() || set2 < 0 || set2 >= this.links.length()) {
            console.log("DisjointSet: Union called on a bad element (negative or too big");
            // continue;
        }
        if (this.links[set1] !== -1 || this.links[set2] !== -1) {
            console.log("DisjoinSet: Union called on a set, not just an element");
            // continue;
        }

        // check rands of each set to determine which will acquire the other (parent v. child)
        if (this.ranks[set1] > this.ranks[set2]) {
            parent = set1;
            child = set2;
        } else {
            parent = set2;
            child = set1;
        }

        // point child's link to the parent set
        // if this changes the parent's rank, increment the parent rank
        this.links[child] = parent;
        if (this.ranks[parent] == this.ranks[child]) {
            this.ranks[parent] += 1;
        }

        // update parent's size to include the child set
        // and move the child set to the beginning of the parent set's elements
        this.sizes[parent] += this.sizes[child];
        this.elements[parent].splice(0, 0, this.elements[child]);

        // remove child set from setIDs by replacing it with the last element
        // and then delete the last element
        last = this.setIds[this.setIds.length() - 1];
        this.setIdIndices[last] = this.setIdIndices[child];
        this.setIds[this.setIdIndices[last]] = last;
        this.setIds.pop();

        return parent;
    }

    // find the parent set of an element
    find = (element) => {
        let parent, child;
        
        // verify valid element param
        if (this.links.length() == 0) {
            console.log("DisjointSet: find called on unitilized DisjointSet");
            // continue;
        }
        if (element < 0 || element >= this.links.length()) {
            console.log("DisjointSet: find called on bad element (negative or too big)");
            // continue;
        }

        // find the root of the tree, setting parents' links to children along the way
        child = -1;
        while (this.links[element] != -1) {
            parent = this.links[element];
            links[element] = child;
            child = element;
            element = parent;
        }

        // traverse back to original element, setting links to root of tree
        parent = element;
        element = child;
        while (element != -1) {
            child = this.links[element];
            this.links[element] = parent;
            element = child;
        }

        return parent;
    }
}